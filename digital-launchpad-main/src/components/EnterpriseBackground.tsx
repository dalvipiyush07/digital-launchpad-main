import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function ParticleNetwork() {
  const { viewport } = useThree();
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const numParticles = 1200;
  const maxLines = 800;
  const cellSize = 1.6;
  const connectionDistSq = cellSize * cellSize;

  // Initialize particles data structures
  const { positions, basePositions, velocities, linePositions } = useMemo(() => {
    const pos = new Float32Array(numParticles * 3);
    const base = new Float32Array(numParticles * 3);
    const vels = new Float32Array(numParticles * 3);
    const lPos = new Float32Array(maxLines * 2 * 3);

    for (let i = 0; i < numParticles; i++) {
      // Position particles in a slightly larger area than viewport
      const x = (Math.random() - 0.5) * 32;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 4;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      base[i * 3] = x;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = z;

      // Slow drift velocity
      vels[i * 3] = (Math.random() - 0.5) * 0.012;
      vels[i * 3 + 1] = (Math.random() - 0.5) * 0.012;
      vels[i * 3 + 2] = (Math.random() - 0.5) * 0.004;
    }

    return { positions: pos, basePositions: base, velocities: vels, linePositions: lPos };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const pointsGeo = pointsRef.current?.geometry;
    const linesGeo = linesRef.current?.geometry;
    if (!pointsGeo || !linesGeo) return;

    const currentPositions = pointsGeo.attributes.position.array as Float32Array;

    // Track mouse in scene space (directly mapping pointer x/y to viewport)
    const mouseX = (state.pointer.x * viewport.width) / 2;
    const mouseY = (state.pointer.y * viewport.height) / 2;
    const hasMouse = state.pointer.x !== 0 || state.pointer.y !== 0;

    // 1. Update particle coordinates
    for (let i = 0; i < numParticles; i++) {
      const idx = i * 3;

      // Slow drift
      basePositions[idx] += velocities[idx] * 0.4;
      basePositions[idx + 1] += velocities[idx + 1] * 0.4;
      basePositions[idx + 2] += velocities[idx + 2] * 0.4;

      // Bound checks - bounce back
      if (Math.abs(basePositions[idx]) > 16) velocities[idx] *= -1;
      if (Math.abs(basePositions[idx + 1]) > 10) velocities[idx + 1] *= -1;
      if (Math.abs(basePositions[idx + 2]) > 2) velocities[idx + 2] *= -1;

      let tx = basePositions[idx];
      let ty = basePositions[idx + 1];
      let tz = basePositions[idx + 2];

      // Interaction attraction & ripple
      if (hasMouse) {
        const dx = tx - mouseX;
        const dy = ty - mouseY;
        const dz = tz;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 4.5) {
          const strength = (4.5 - dist) / 4.5;
          
          // Pull target towards mouse
          const pullX = mouseX - tx;
          const pullY = mouseY - ty;
          const pullZ = -tz;

          tx += pullX * strength * 0.55;
          ty += pullY * strength * 0.55;
          tz += pullZ * strength * 0.55;

          // Radiating ripple effect (trigonometric wave)
          const wave = Math.sin(dist * 3.5 - time * 6.0) * 0.15 * strength;
          const dirX = dx / (dist || 1);
          const dirY = dy / (dist || 1);
          const dirZ = dz / (dist || 1);

          tx -= dirX * wave;
          ty -= dirY * wave;
          tz -= dirZ * wave;
        }
      }

      // Smooth lerp of current coordinates to target
      currentPositions[idx] += (tx - currentPositions[idx]) * 0.08;
      currentPositions[idx + 1] += (ty - currentPositions[idx + 1]) * 0.08;
      currentPositions[idx + 2] += (tz - currentPositions[idx + 2]) * 0.08;
    }
    pointsGeo.attributes.position.needsUpdate = true;

    // 2. Spatial Hash Grid for connections
    const grid = new Map<string, number[]>();
    for (let i = 0; i < numParticles; i++) {
      const idx = i * 3;
      const cx = Math.floor(currentPositions[idx] / cellSize);
      const cy = Math.floor(currentPositions[idx + 1] / cellSize);
      const key = `${cx},${cy}`;
      let list = grid.get(key);
      if (!list) {
        list = [];
        grid.set(key, list);
      }
      list.push(i);
    }

    let lineIndex = 0;
    const currentLinePositions = linesGeo.attributes.position.array as Float32Array;

    for (const [key, cellParticles] of grid.entries()) {
      const [cxStr, cyStr] = key.split(",");
      const cx = parseInt(cxStr);
      const cy = parseInt(cyStr);

      for (let dx = 0; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy < 0) continue; // prevent double checks

          const nkey = `${cx + dx},${cy + dy}`;
          const neighborParticles = grid.get(nkey);
          if (!neighborParticles) continue;

          for (const i of cellParticles) {
            const idxI = i * 3;
            const ix = currentPositions[idxI];
            const iy = currentPositions[idxI + 1];
            const iz = currentPositions[idxI + 2];

            for (const j of neighborParticles) {
              if (i >= j) continue;

              const idxJ = j * 3;
              const jx = currentPositions[idxJ];
              const jy = currentPositions[idxJ + 1];
              const jz = currentPositions[idxJ + 2];

              const diffX = ix - jx;
              const diffY = iy - jy;
              const diffZ = iz - jz;
              const distSq = diffX * diffX + diffY * diffY + diffZ * diffZ;

              if (distSq < connectionDistSq) {
                const lineOffset = lineIndex * 6;
                currentLinePositions[lineOffset] = ix;
                currentLinePositions[lineOffset + 1] = iy;
                currentLinePositions[lineOffset + 2] = iz;

                currentLinePositions[lineOffset + 3] = jx;
                currentLinePositions[lineOffset + 4] = jy;
                currentLinePositions[lineOffset + 5] = jz;

                lineIndex++;
                if (lineIndex >= maxLines) break;
              }
            }
            if (lineIndex >= maxLines) break;
          }
          if (lineIndex >= maxLines) break;
        }
        if (lineIndex >= maxLines) break;
      }
      if (lineIndex >= maxLines) break;
    }

    linesGeo.attributes.position.needsUpdate = true;
    linesGeo.setDrawRange(0, lineIndex * 2);
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          color="#9ca3af" // Light gray particles
          transparent
          opacity={0.35}
          sizeAttenuation
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#7B2CF5" // Soft purple lines
          transparent
          opacity={0.05} // Subtle connection lines
          linewidth={1}
        />
      </lineSegments>
    </>
  );
}

export default function EnterpriseBackground() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 bg-white">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        className="w-full h-full"
      >
        <ParticleNetwork />
      </Canvas>
    </div>
  );
}

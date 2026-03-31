import { useState, useEffect } from "react";

const IMG_BASE = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  ? ''
  : 'http://localhost:8081';

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/works');
      const data = await response.json();
      const sorted = data.sort((a, b) => (a.priority || 999) - (b.priority || 999));
      setProjects(sorted);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayedProjects = showAll ? projects : projects.slice(0, 6);

  return (
    <section id="work" className="py-12 lg:py-16 section-alt">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 fade-up section-heading">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Our Work</span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl mt-2">
            Turning Visions Into Digital Reality
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Real projects, real results. Here's what we've built for our clients.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProjects.map((p, i) => (
                <div
                  key={p.id}
                  className="project-card rounded-lg border border-border bg-background overflow-hidden group"
                  style={{ 
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  <div className="relative overflow-hidden">
                    <img src={p.coverImage?.startsWith('/uploads') ? `${IMG_BASE}${p.coverImage}` : p.coverImage} alt={p.name} className="cover-image w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <h3 className="font-heading font-bold text-lg text-white">{p.name}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                      {p.tag}
                    </span>
                    <p className="text-sm text-muted-foreground mb-4">{p.desc}</p>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      View Live Site →
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {projects.length > 6 && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-8 py-3 rounded-full border-2 border-foreground font-semibold hover:bg-foreground hover:text-background transition-all duration-300"
                >
                  {showAll ? 'View Less ↑' : 'View More →'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

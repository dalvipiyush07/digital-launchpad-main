import React from "react";

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  theme?: "light" | "dark";
}

export default function Logo({
  className = "",
  iconSize = 28,
  textSize = "text-xl md:text-2xl",
  theme = "light",
}: LogoProps) {
  const isDarkTheme = theme === "dark";
  const mainColorClass = isDarkTheme ? "text-white" : "text-black";

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Outer Hexagon - Technical Structure */}
        <path
          d="M12 2L3 7.2V16.8L12 22L21 16.8V7.2L12 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={mainColorClass}
        />
        {/* Inner Tech Core - Purple Accent */}
        <path
          d="M12 6.5L6.5 9.7V14.3L12 17.5L17.5 14.3V9.7L12 6.5Z"
          fill="#7B2CF5"
          fillOpacity="0.12"
          stroke="#7B2CF5"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Central Core Node */}
        <circle cx="12" cy="12" r="2.5" fill="#7B2CF5" />
      </svg>
      <span className={`font-heading font-black tracking-tight leading-none ${mainColorClass} ${textSize}`}>
        Cloud<span className="text-[#7B2CF5] font-semibold">Build</span>
      </span>
    </div>
  );
}

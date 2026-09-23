interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logo-sun" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f4d35e" />
          <stop offset="60%" stopColor="#e07a3d" />
          <stop offset="100%" stopColor="#2d6a4f" />
        </linearGradient>
      </defs>
      <path
        d="M24 5a19 19 0 1 0 0 38 19 19 0 0 0 0-38z"
        transform="rotate(-8 24 24)"
        fill="none"
        stroke="url(#logo-sun)"
        strokeWidth="2.5"
      />
      <path
        d="M14 22c0-6 4-10 10-10s8 3 8 7c0 5-4 6-6 7"
        fill="none"
        stroke="#f4d35e"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="22" cy="20" r="2.4" fill="#2d6a4f" />
      <circle cx="28.5" cy="23.5" r="1.8" fill="#d94a1c" />
      <circle cx="17" cy="27" r="1.6" fill="#3a7bd5" />
      <path
        d="M30 33c4-1.5 5.5-4.5 5.5-8 .3 2 1.6 3.4 4 4-2 .6-3.4 2-3.8 4-1.2-1.6-2.6-2.4-5.7-2z"
        fill="#2ec4b6"
        opacity="0.9"
      />
      <path
        d="M12 34l6-6M10 38l4-4"
        stroke="#c9c0cb"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}
import type { ReactNode, SVGProps } from 'react';

export type IconName =
  | 'brush'
  | 'palette'
  | 'book'
  | 'film'
  | 'gamepad'
  | 'search'
  | 'sparkles'
  | 'compass'
  | 'chart'
  | 'clock'
  | 'check-circle'
  | 'play'
  | 'x-circle'
  | 'eye'
  | 'plus'
  | 'minus'
  | 'trash'
  | 'edit'
  | 'chevron-down'
  | 'arrow-right'
  | 'log-out'
  | 'user'
  | 'menu'
  | 'close'
  | 'mail'
  | 'lock'
  | 'star'
  | 'download'
  | 'filter'
  | 'refresh'
  | 'flame'
  | 'layers'
  | 'target'
  | 'archive';

const PATHS: Record<IconName, ReactNode> = {
  brush: (
    <>
      <path d="M9.5 13.5c-2 0-4 1-4 3.5 0 1.5-1 2.5-2 3 1 .5 2 1 3.5 1 3 0 4.5-2.5 4.5-5 0-1.5-.5-2.5-2-2.5z" />
      <path d="M14 11.5l6.5-6.5c.5-.5.5-1.5 0-2s-1.5-.5-2 0L12 9" />
      <path d="M11 10l3 3" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3.5A8.5 8.5 0 1 0 20.5 12c0-1.4-.5-2.3-1.5-2.4l-1.6-.3c-.5-.1-.9-.4-1.1-.9l-.3-.7c-.6-1.4-1.3-2-2.5-2V3.5z" />
      <circle cx="8" cy="10" r="1.2" />
      <circle cx="10.5" cy="7" r="1.2" />
      <circle cx="15" cy="9" r="1.2" />
    </>
  ),
  book: (
    <>
      <path d="M12 6.5C10.5 5 8.5 4.5 4 4.5v13c4.5 0 6.5.5 8 2m0-13c1.5-1.5 3.5-2 8-2v13c-4.5 0-6.5.5-8 2m0-13v15" />
    </>
  ),
  film: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M8 4.5v15M16 4.5v15M3.5 9.5h4.5M3.5 14.5h4.5M16 9.5h4.5M16 14.5h4.5" />
    </>
  ),
  gamepad: (
    <>
      <path d="M7 8.5h4M9 6.5v4" />
      <path d="M4.5 15a2.5 2.5 0 0 0 2.4 1.9c1.3 0 2.1-.8 3-1.9l.3-.4c.5-.6 1.1-.9 1.8-.9s1.3.3 1.8.9l.3.4c.9 1.1 1.7 1.9 3 1.9A2.5 2.5 0 0 0 19.5 15c0-1.5-1.5-2.5-2.8-3.7l-1-1C14.7 9.3 13.4 8.5 12 8.5s-2.7.8-3.7 1.8l-1 1c-1.3 1.2-2.8 2.2-2.8 3.7z" />
      <path d="M16.5 14.5h.01M18.5 12.5h.01" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3.5c.6 3.2 2.3 4.9 5.5 5.5-3.2.6-4.9 2.3-5.5 5.5-.6-3.2-2.3-4.9-5.5-5.5 3.2-.6 4.9-2.3 5.5-5.5z" />
      <path d="M18.5 13.5c.3 1.6 1.1 2.4 2.5 2.7-1.4.3-2.2 1.1-2.5 2.7-.3-1.6-1.1-2.4-2.5-2.7 1.4-.3 2.2-1.1 2.5-2.7z" />
      <path d="M5.5 14c.2 1.2.8 1.8 2 2-1.2.2-1.8.8-2 2-.2-1.2-.8-1.8-2-2 1.2-.2 1.8-.8 2-2z" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" />
    </>
  ),
  chart: (
    <>
      <path d="M4.5 19.5V14M9.75 19.5V9M15 19.5V12M20.25 19.5V5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.5l2.3 2.3 4.7-5" />
    </>
  ),
  play: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10 8.5l5.5 3.5-5.5 3.5v-7z" />
    </>
  ),
  'x-circle': (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </>
  ),
  eye: (
    <>
      <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  trash: (
    <>
      <path d="M5 7h14M10 7V5.5A1.5 1.5 0 0 1 11.5 4h1A1.5 1.5 0 0 1 14 5.5V7M6.5 7l.7 12a1.5 1.5 0 0 0 1.5 1.4h6.6a1.5 1.5 0 0 0 1.5-1.4l.7-12" />
      <path d="M10 11v5M14 11v5" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h16" />
      <path d="M14.5 4.5l5 5L9 20H4v-5l10.5-10.5z" />
    </>
  ),
  'chevron-down': <path d="M6 9l6 6 6-6" />,
  'arrow-right': <path d="M4 12h16M14 6l6 6-6 6" />,
  'log-out': (
    <>
      <path d="M14 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7" />
      <path d="M10 12h10M16 8l4 4-4 4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  star: (
    <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8 2.6-5.4z" />
  ),
  download: (
    <>
      <path d="M12 4v10M8 10l4 4 4-4" />
      <path d="M4.5 19.5h15" />
    </>
  ),
  filter: (
    <>
      <path d="M4 5.5h16M7 12h10M10 18.5h4" />
    </>
  ),
  refresh: (
    <>
      <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
      <path d="M4.5 3.5v4.5H9" />
    </>
  ),
  flame: (
    <path d="M12 20.5c-3.5 0-6-2.4-6-5.6 0-2.8 2-4.5 3.2-5.8 1-1 1.6-2.2 1.8-4.1 2.7 1.3 4.4 3.6 4.4 6 0 .4 0 .9-.1 1.3 1-.6 1.7-1.6 1.7-3.1 1.9 1.7 3 3.8 3 5.7 0 3.2-2.5 5.6-8 5.6z" />
  ),
  layers: (
    <>
      <path d="M12 3.5l8.5 4.5-8.5 4.5L3.5 8 12 3.5z" />
      <path d="M4.5 13L12 17l7.5-4" />
      <path d="M4.5 17L12 21l7.5-4" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  archive: (
    <>
      <rect x="4" y="4" width="16" height="5" rx="1.5" />
      <path d="M6 9v9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9M10 13h4" />
    </>
  ),
};

export interface IconProps extends SVGProps<SVGSVGElement> {
  icon: IconName;
  size?: number;
}

export function Icon({ icon, size = 20, className = '', ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {PATHS[icon]}
    </svg>
  );
}
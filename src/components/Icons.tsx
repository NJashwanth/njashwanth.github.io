type IconProps = { size?: number; className?: string };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  'aria-hidden': true as const,
  focusable: false as const,
});

export const ArrowUpRight = ({ size = 14, className }: IconProps) => (
  <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export const ArrowDown = ({ size = 14, className }: IconProps) => (
  <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
);

export const GitHubIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className} fill="currentColor">
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.08.68-.22.68-.49v-1.73c-2.78.61-3.37-1.2-3.37-1.2-.46-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .08 1.52 1.01 1.52 1.01.88 1.51 2.32 1.07 2.88.82.09-.64.35-1.08.63-1.33-2.22-.25-4.56-1.1-4.56-4.9 0-1.08.39-1.96 1.02-2.65-.1-.25-.44-1.29.1-2.7 0 0 .84-.26 2.75 1.01a9.6 9.6 0 0 1 5 0c1.9-1.27 2.74-1.01 2.74-1.01.54 1.41.2 2.45.1 2.7.64.69 1.02 1.57 1.02 2.65 0 3.81-2.35 4.64-4.58 4.88.36.31.68.93.68 1.89V21c0 .27.18.57.69.49A10 10 0 0 0 12 2z" />
  </svg>
);

export const LinkedInIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className} fill="currentColor">
    <path d="M6.94 8.5a1.56 1.56 0 1 1 0-3.12 1.56 1.56 0 0 1 0 3.12zM5.6 10.1h2.67v8.3H5.6v-8.3zm4.25 0h2.56v1.14h.04c.36-.68 1.23-1.39 2.53-1.39 2.7 0 3.2 1.78 3.2 4.09v4.46h-2.67v-3.95c0-.94-.02-2.15-1.31-2.15-1.31 0-1.5 1.02-1.5 2.08v4.02H9.85v-8.3z" />
  </svg>
);

export const MailIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <path d="m3.5 6 8.5 7 8.5-7" />
  </svg>
);

export const SunIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

export const MoonIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
  </svg>
);

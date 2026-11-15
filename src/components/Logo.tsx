export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="#0E7C86" />
      <rect x="6" y="14" width="8" height="4" rx="1" fill="#fff" />
      <rect x="18" y="14" width="8" height="4" rx="1" fill="#fff" />
    </svg>
  );
}

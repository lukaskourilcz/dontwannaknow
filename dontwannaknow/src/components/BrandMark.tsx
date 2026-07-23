export default function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      width="48"
      height="48"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="48" height="48" rx="6" fill="currentColor" />
      <path d="M11 12h26v5.5h-10V37h-6V17.5H11z" fill="var(--color-brand-mark-paper, #f6f3ec)" />
    </svg>
  );
}

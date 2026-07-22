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
      <rect width="48" height="48" rx="10" fill="currentColor" />
      <path d="M11 12h26v5.5h-10V37h-6V17.5H11z" fill="var(--color-brand-mark-paper, #f7f2e8)" />
      <path d="M35.5 32.5v7h-7" fill="none" stroke="var(--color-brand-mark-accent, #d9684f)" strokeWidth="3" />
    </svg>
  );
}

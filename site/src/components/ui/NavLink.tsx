export function NavLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      className="text-caption cursor-pointer uppercase text-ink-muted transition-colors hover:text-brand"
    >
      {children}
    </a>
  )
}

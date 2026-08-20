import { Link } from "@tanstack/react-router";

export function BrandHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Full Sound Garage"
            className="h-10 w-auto rounded-md"
            width={96}
            height={40}
          />
          <span className="sr-only">Full Sound Garage</span>
        </Link>
<nav className="flex items-center gap-4 text-sm font-medium">
  <Link to="/agendar" className="text-foreground hover:text-primary">
    Agendar
  </Link>
  <Link to="/meus-agendamentos" className="text-muted-foreground hover:text-primary">
    Meus agendamentos
  </Link>
  <Link to="/admin" className="text-muted-foreground hover:text-primary">
    Painel
  </Link>
</nav>
      </div>
    </header>
  );
}
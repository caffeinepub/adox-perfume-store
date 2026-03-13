import { useEffect, useState } from "react";
import { SiFacebook, SiInstagram } from "react-icons/si";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-nav" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="font-display text-2xl font-bold tracking-[0.2em] text-gold uppercase"
        >
          ADOX
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            type="button"
            data-ocid="nav.home_link"
            onClick={() => scrollTo("hero")}
            className="font-body text-sm font-medium tracking-widest uppercase text-foreground/80 hover:text-gold transition-colors"
          >
            Home
          </button>
          <button
            type="button"
            data-ocid="nav.products_link"
            onClick={() => scrollTo("products")}
            className="font-body text-sm font-medium tracking-widest uppercase text-foreground/80 hover:text-gold transition-colors"
          >
            Products
          </button>
          <button
            type="button"
            data-ocid="nav.about_link"
            onClick={() => scrollTo("about")}
            className="font-body text-sm font-medium tracking-widest uppercase text-foreground/80 hover:text-gold transition-colors"
          >
            About
          </button>
          <button
            type="button"
            data-ocid="nav.contact_link"
            onClick={() => scrollTo("contact")}
            className="font-body text-sm font-medium tracking-widest uppercase text-foreground/80 hover:text-gold transition-colors"
          >
            Contact
          </button>
        </nav>

        {/* Social Icons */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://www.facebook.com/share/18CWDtMFHZ/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/60 hover:text-gold transition-colors"
            aria-label="Facebook"
          >
            <SiFacebook size={18} />
          </a>
          <a
            href="https://www.instagram.com/tansin.litun"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/60 hover:text-gold transition-colors"
            aria-label="Instagram"
          >
            <SiInstagram size={18} />
          </a>
          <a
            href="/admin"
            className="font-body text-xs font-medium tracking-widest uppercase text-foreground/40 hover:text-gold transition-colors ml-2"
          >
            Admin
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden text-foreground/80 hover:text-gold transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span
              className={`block h-px bg-current transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-px bg-current transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-px bg-current transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass-nav border-t border-border/50">
          <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
            {["hero", "products", "about", "contact"].map((id) => (
              <button
                type="button"
                key={id}
                onClick={() => scrollTo(id)}
                className="font-body text-sm font-medium tracking-widest uppercase text-foreground/80 hover:text-gold transition-colors text-left"
              >
                {id === "hero"
                  ? "Home"
                  : id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://www.facebook.com/share/18CWDtMFHZ/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-gold transition-colors"
              >
                <SiFacebook size={18} />
              </a>
              <a
                href="https://www.instagram.com/tansin.litun"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-gold transition-colors"
              >
                <SiInstagram size={18} />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

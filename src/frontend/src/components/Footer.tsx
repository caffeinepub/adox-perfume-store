import { SiFacebook, SiInstagram, SiWhatsapp } from "react-icons/si";
import { useSiteContent } from "../hooks/useQueries";

export default function Footer() {
  const { data: footerText } = useSiteContent(
    "footerText",
    "© 2024 Adox. All rights reserved.",
  );
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="bg-card border-t border-border/50 py-12 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <div className="font-display text-2xl font-bold tracking-[0.3em] text-gold uppercase">
            ADOX
          </div>

          {/* Gold divider */}
          <div className="gold-divider max-w-[100px] w-full" />

          {/* Social */}
          <div className="flex items-center gap-6">
            <a
              href="https://www.facebook.com/share/18CWDtMFHZ/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/50 hover:text-primary transition-colors"
              aria-label="Facebook"
            >
              <SiFacebook size={20} />
            </a>
            <a
              href="https://www.instagram.com/tansin.litun"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/50 hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <SiInstagram size={20} />
            </a>
            <a
              href="https://wa.me/8801962656880"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/50 hover:text-primary transition-colors"
              aria-label="WhatsApp"
            >
              <SiWhatsapp size={20} />
            </a>
          </div>

          {/* Footer text */}
          <p className="font-body text-xs text-foreground/40 text-center">
            {footerText}
          </p>

          {/* Caffeine attribution */}
          <p className="font-body text-xs text-foreground/25 text-center">
            © {year}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary/60 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

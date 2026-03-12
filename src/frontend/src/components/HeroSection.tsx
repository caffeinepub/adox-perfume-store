import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useSiteContent } from "../hooks/useQueries";

const DEFAULT_HERO_IMAGE = "/assets/generated/hero-perfume.dim_1200x700.jpg";

export default function HeroSection() {
  const { data: headline } = useSiteContent(
    "heroHeadline",
    "Adox – Define Your Signature Scent",
  );
  const { data: subheading } = useSiteContent(
    "heroSubheading",
    "Premium perfumes crafted to express your personality.",
  );
  const { data: heroImage } = useSiteContent("heroImage", "");

  // Preload hero image to eliminate flash of wrong/placeholder image
  const backgroundImage = heroImage || DEFAULT_HERO_IMAGE;
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const loadingRef = useRef("");

  useEffect(() => {
    if (loadingRef.current === backgroundImage) return;
    loadingRef.current = backgroundImage;
    const img = new Image();
    img.onload = () => setLoadedSrc(backgroundImage);
    img.onerror = () => setLoadedSrc(backgroundImage);
    img.src = backgroundImage;
  }, [backgroundImage]);

  const displaySrc = loadedSrc ?? null;

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Solid navy fallback -- always visible */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "oklch(0.11 0.022 260)" }}
      />
      {/* Background Image -- fades in once preloaded */}
      {displaySrc && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-fade-in"
          style={{ backgroundImage: `url('${displaySrc}')` }}
        />
      )}
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/65" />
      {/* Gold gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Pre-headline */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, letterSpacing: "0.3em" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="font-body text-xs font-medium tracking-[0.4em] uppercase text-primary mb-6"
        >
          Luxury Fragrances
        </motion.p>

        {/* Gold divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="gold-divider max-w-xs mx-auto mb-8"
        />

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground mb-6"
        >
          {headline}
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: "easeOut" }}
          className="font-body text-base sm:text-lg md:text-xl text-foreground/70 mb-10 max-w-xl mx-auto"
        >
          {subheading}
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          data-ocid="hero.primary_button"
          onClick={scrollToProducts}
          className="btn-gold px-10 py-4 text-sm tracking-widest uppercase font-semibold"
        >
          Shop Now
        </motion.button>

        {/* Bottom divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="gold-divider max-w-xs mx-auto mt-12"
        />
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-body text-xs tracking-widest uppercase text-foreground/30">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.5,
            ease: "easeInOut",
          }}
          className="w-px h-8 bg-gradient-to-b from-primary/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}

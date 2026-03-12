import { motion } from "motion/react";
import { useSiteContent } from "../hooks/useQueries";

export default function AboutSection() {
  const { data: title } = useSiteContent("aboutTitle", "About Adox");
  const { data: text } = useSiteContent(
    "aboutText",
    "Adox is a premium perfume brand dedicated to crafting unforgettable scents. Each fragrance is carefully formulated to express individuality and elegance.",
  );

  return (
    <section id="about" className="py-24 px-6 bg-card relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, oklch(0.72 0.11 82) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="font-body text-xs tracking-[0.4em] uppercase text-primary mb-4">
            Our Story
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-8">
            {title}
          </h2>
          <div className="gold-divider max-w-[80px] mx-auto mb-8" />
          <p className="font-body text-base sm:text-lg text-foreground/70 leading-relaxed">
            {text}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16">
            {[
              { value: "50+", label: "Fragrances" },
              { value: "10K+", label: "Happy Clients" },
              { value: "5★", label: "Rated" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center"
              >
                <div className="font-display text-2xl sm:text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="font-body text-xs tracking-widest uppercase text-foreground/40">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

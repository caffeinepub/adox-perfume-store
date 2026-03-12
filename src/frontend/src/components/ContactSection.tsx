import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useSiteContent } from "../hooks/useQueries";

export default function ContactSection() {
  const { data: contactText } = useSiteContent(
    "contactText",
    "We'd love to hear from you. Reach out via the form below or connect with us on social media.",
  );

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="font-body text-xs tracking-[0.4em] uppercase text-primary mb-4">
            Get In Touch
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Contact Us
          </h2>
          <div className="gold-divider max-w-[100px] mx-auto mb-6" />
          <p className="font-body text-foreground/60 max-w-lg mx-auto">
            {contactText}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-xl mx-auto"
        >
          {submitted ? (
            <div
              className="flex flex-col items-center gap-4 py-16"
              data-ocid="contact.success_state"
            >
              <CheckCircle2 className="w-16 h-16 text-primary" />
              <h3 className="font-display text-2xl font-semibold text-foreground">
                Message Sent!
              </h3>
              <p className="font-body text-foreground/60 text-center">
                Thank you for reaching out. We'll get back to you within 24
                hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: "", email: "", message: "" });
                }}
                className="btn-gold-outline px-6 py-2 text-xs tracking-widest uppercase mt-4"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="contact-name"
                  className="font-body text-xs tracking-widest uppercase text-foreground/50 mb-2 block"
                >
                  Your Name
                </label>
                <Input
                  id="contact-name"
                  data-ocid="contact.input"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="John Doe"
                  required
                  className="bg-card border-border focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="font-body text-xs tracking-widest uppercase text-foreground/50 mb-2 block"
                >
                  Email Address
                </label>
                <Input
                  id="contact-email"
                  data-ocid="contact.email_input"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="you@example.com"
                  required
                  className="bg-card border-border focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-message"
                  className="font-body text-xs tracking-widest uppercase text-foreground/50 mb-2 block"
                >
                  Message
                </label>
                <Textarea
                  id="contact-message"
                  data-ocid="contact.textarea"
                  value={form.message}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, message: e.target.value }))
                  }
                  placeholder="Tell us about your fragrance preferences..."
                  required
                  rows={5}
                  className="bg-card border-border focus:border-primary transition-colors resize-none"
                />
              </div>
              <Button
                type="submit"
                data-ocid="contact.submit_button"
                disabled={loading}
                className="btn-gold w-full py-3 text-sm tracking-widest uppercase font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

import { SiWhatsapp } from "react-icons/si";

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/8801962656880"
      target="_blank"
      rel="noopener noreferrer"
      data-ocid="whatsapp.button"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center animate-pulse-glow transition-transform hover:scale-110"
      style={{ backgroundColor: "oklch(0.52 0.2 145)" }}
    >
      <SiWhatsapp size={26} color="white" />
    </a>
  );
}

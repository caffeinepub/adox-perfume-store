import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import ProductsSection from "../components/ProductsSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        {/* Section divider */}
        <div className="gold-divider opacity-30" />
        <ProductsSection />
        <div className="gold-divider opacity-30" />
        <AboutSection />
        <div className="gold-divider opacity-30" />
        <ContactSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

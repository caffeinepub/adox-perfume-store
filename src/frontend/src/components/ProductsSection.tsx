import { Loader2, ShoppingBag, Star } from "lucide-react";
import { motion } from "motion/react";
import { useActor } from "../hooks/useActor";
import { useProducts } from "../hooks/useQueries";
import { formatPrice } from "../lib/formatPrice";

const WA_NUMBER = "8801962656880";

function buildWhatsAppUrl(name: string, price: string): string {
  const msg = `Hi, I want to order the perfume: ${name} – Price: ${price}`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

// Category badge labels for sample products
const SAMPLE_BADGES = ["Best Seller", "New Arrival", "Exclusive", "Popular"];

export default function ProductsSection() {
  const { data: products, isLoading } = useProducts();
  const { actor, isFetching: actorLoading } = useActor();

  const stillLoading = isLoading || actorLoading || !actor;
  const displayProducts = stillLoading ? SAMPLE_PRODUCTS : (products ?? []);

  return (
    <section id="products" className="py-24 px-6" data-ocid="products.section">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.4em] uppercase text-primary mb-4">
            Our Collection
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Signature Fragrances
          </h2>
          <div className="gold-divider max-w-[120px] mx-auto" />
        </motion.div>

        {/* Loading State */}
        {stillLoading && (
          <div
            className="flex justify-center items-center py-20"
            data-ocid="products.loading_state"
          >
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {/* Products Grid */}
        {!stillLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProducts.map((product, idx) => {
              const priceStr = formatPrice(product.price);
              const imgUrl = product.image
                ? product.image.getDirectURL()
                : getSampleImage(idx);
              const ocidIdx = idx + 1;
              const badge = SAMPLE_BADGES[idx % SAMPLE_BADGES.length];
              return (
                <motion.div
                  key={String(product.id)}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  data-ocid={`product.item.${ocidIdx}`}
                  className="luxury-card group overflow-hidden flex flex-col"
                >
                  {/* Product Image */}
                  <div
                    className="relative overflow-hidden"
                    style={{ aspectRatio: "4/3" }}
                  >
                    <img
                      src={imgUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/assets/generated/product-placeholder.dim_600x600.jpg";
                      }}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
                    {/* Badge */}
                    {idx < 4 && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase bg-primary text-primary-foreground font-body">
                        {badge}
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Name & price row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-display text-xl font-semibold text-foreground leading-snug">
                        {product.name}
                      </h3>
                      <span className="font-display text-lg font-bold text-primary whitespace-nowrap">
                        {priceStr}
                      </span>
                    </div>

                    {/* Star rating (decorative) */}
                    <div className="flex items-center gap-0.5 mb-3">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={12}
                          className="text-primary fill-primary"
                        />
                      ))}
                      <span className="font-body text-xs text-foreground/40 ml-2">
                        5.0
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="gold-divider mb-3 opacity-40" />

                    {/* Description */}
                    <p className="font-body text-sm text-foreground/65 mb-5 line-clamp-2 leading-relaxed flex-1">
                      {product.description}
                    </p>

                    {/* CTA */}
                    <a
                      href={buildWhatsAppUrl(product.name, priceStr)}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-ocid={`product.button.${ocidIdx}`}
                      className="btn-gold-outline px-5 py-2.5 text-xs flex items-center justify-center gap-2 hover:no-underline w-full"
                    >
                      <ShoppingBag size={14} />
                      Order via WhatsApp
                    </a>
                  </div>
                </motion.div>
              );
            })}

            {/* Empty state */}
            {displayProducts.length === 0 && (
              <div
                className="col-span-full text-center py-20"
                data-ocid="products.empty_state"
              >
                <p className="font-body text-foreground/40 tracking-widest uppercase text-sm">
                  Products coming soon
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function getSampleImage(idx: number): string {
  const images = [
    "/assets/generated/product-oud-noir.dim_600x600.jpg",
    "/assets/generated/product-rose-elixir.dim_600x600.jpg",
    "/assets/generated/product-noir-legend.dim_600x600.jpg",
    "/assets/generated/product-midnight-crystal.dim_600x600.jpg",
    "/assets/generated/product-placeholder.dim_600x600.jpg",
  ];
  return images[idx % images.length];
}

const SAMPLE_PRODUCTS = [
  {
    id: 1n,
    name: "Oud Noir",
    description:
      "A deep, smoky oud with hints of saffron and amber. A journey through Arabian nights.",
    price: 2800n,
    position: 1n,
    image: undefined,
  },
  {
    id: 2n,
    name: "Rose Elixir",
    description:
      "Bulgarian rose petals entwined with soft musk and white cedar for feminine elegance.",
    price: 2200n,
    position: 2n,
    image: undefined,
  },
  {
    id: 3n,
    name: "Noir Legend",
    description:
      "Bold bergamot and black pepper, anchored by vetiver and sandalwood. Power redefined.",
    price: 3200n,
    position: 3n,
    image: undefined,
  },
  {
    id: 4n,
    name: "Midnight Crystal",
    description:
      "An aquatic yet luxurious fragrance — cool ocean breeze meets warm ambergris.",
    price: 2600n,
    position: 4n,
    image: undefined,
  },
];

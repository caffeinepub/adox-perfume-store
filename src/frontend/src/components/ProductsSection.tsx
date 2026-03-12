import { Loader2, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useActor } from "../hooks/useActor";
import { useProducts } from "../hooks/useQueries";
import { formatPrice } from "../lib/formatPrice";

const WA_NUMBER = "8801962656880";

function buildWhatsAppUrl(name: string, price: string): string {
  const msg = `Hi, I want to order the perfume: ${name} – Price: ${price}`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export default function ProductsSection() {
  const { data: products, isLoading } = useProducts();
  const { actor, isFetching: actorLoading } = useActor();

  // Show loading while actor initializes or products are loading
  const stillLoading = isLoading || actorLoading || !actor;

  // Only fall back to sample products while we're still loading (actor not ready yet)
  // Once actor is ready and products are fetched, show real data (even if empty)
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
              return (
                <motion.div
                  key={String(product.id)}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  data-ocid={`product.item.${ocidIdx}`}
                  className="luxury-card group overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden aspect-square bg-card">
                    <img
                      src={imgUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/assets/generated/product-placeholder.dim_600x600.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="gold-divider mb-4 opacity-50" />
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      {product.name}
                    </h3>
                    <p className="font-body text-sm text-foreground/60 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-lg font-bold text-primary">
                        {priceStr}
                      </span>
                      <a
                        href={buildWhatsAppUrl(product.name, priceStr)}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-ocid={`product.button.${ocidIdx}`}
                        className="btn-gold-outline px-4 py-2 text-xs flex items-center gap-2 hover:no-underline"
                      >
                        <ShoppingBag size={14} />
                        Buy Now
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Empty state when no products saved yet */}
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

// Shown only while the backend connection is initializing
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

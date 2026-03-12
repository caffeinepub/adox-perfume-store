import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../../backend";
import type { ExternalBlob } from "../../backend";
import {
  useCreateProduct,
  useDeleteProduct,
  useEditProduct,
  useProducts,
  useReorderProducts,
} from "../../hooks/useQueries";
import { formatPrice } from "../../lib/formatPrice";
import ProductModal from "./ProductModal";

export default function ProductsTab() {
  const { data: products, isLoading } = useProducts();
  const createMutation = useCreateProduct();
  const editMutation = useEditProduct();
  const deleteMutation = useDeleteProduct();
  const reorderMutation = useReorderProducts();

  const [addOpen, setAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const handleCreate = async (data: {
    name: string;
    description: string;
    price: bigint;
    image?: ExternalBlob;
  }) => {
    try {
      await createMutation.mutateAsync(data);
      setAddOpen(false);
      toast.success("Product added!");
    } catch {
      toast.error("Failed to add product");
    }
  };

  const handleEdit = async (data: {
    name: string;
    description: string;
    price: bigint;
    image?: ExternalBlob;
  }) => {
    if (!editProduct) return;
    try {
      await editMutation.mutateAsync({
        id: editProduct.id,
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image ?? editProduct.image,
      });
      setEditProduct(null);
      toast.success("Product updated!");
    } catch {
      toast.error("Failed to update product");
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
      toast.success("Product deleted.");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (!products) return;
    const list = [...products];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    try {
      await reorderMutation.mutateAsync(list.map((p) => p.id));
    } catch {
      toast.error("Reorder failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl font-semibold text-foreground">
          Manage Products
        </h3>
        <Button
          type="button"
          data-ocid="admin.product.add_button"
          onClick={() => setAddOpen(true)}
          className="btn-gold text-xs tracking-widest uppercase flex items-center gap-2"
        >
          <Plus size={14} /> Add Product
        </Button>
      </div>

      {isLoading && (
        <div
          className="flex justify-center py-12"
          data-ocid="products.loading_state"
        >
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      )}

      {!isLoading && products && products.length === 0 && (
        <div className="text-center py-12" data-ocid="products.empty_state">
          <p className="font-body text-foreground/40 text-sm tracking-widest uppercase">
            No products yet. Add your first product.
          </p>
        </div>
      )}

      {!isLoading && products && products.length > 0 && (
        <div className="space-y-3">
          {products.map((product, idx) => {
            const ocidIdx = idx + 1;
            const imgUrl = product.image
              ? product.image.getDirectURL()
              : "/assets/generated/product-placeholder.dim_600x600.jpg";
            return (
              <div
                key={String(product.id)}
                data-ocid="admin.product.row"
                className="flex items-center gap-4 p-4 bg-background border border-border hover:border-primary/40 transition-colors"
              >
                {/* Reorder */}
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(idx, "up")}
                    disabled={idx === 0 || reorderMutation.isPending}
                    className="text-foreground/30 hover:text-primary disabled:opacity-20 transition-colors"
                    aria-label="Move up"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(idx, "down")}
                    disabled={
                      idx === products.length - 1 || reorderMutation.isPending
                    }
                    className="text-foreground/30 hover:text-primary disabled:opacity-20 transition-colors"
                    aria-label="Move down"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>

                {/* Image */}
                <img
                  src={imgUrl}
                  alt={product.name}
                  className="w-14 h-14 object-cover border border-border flex-shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm font-semibold text-foreground truncate">
                    {product.name}
                  </p>
                  <p className="font-body text-xs text-foreground/50">
                    {formatPrice(product.price)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    data-ocid={`admin.product.edit_button.${ocidIdx}`}
                    onClick={() => setEditProduct(product)}
                    className="text-foreground/50 hover:text-primary"
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    data-ocid={`admin.product.delete_button.${ocidIdx}`}
                    onClick={() => setDeleteId(product.id)}
                    className="text-foreground/50 hover:text-destructive"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      <ProductModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />

      {/* Edit Modal */}
      {editProduct && (
        <ProductModal
          open={!!editProduct}
          onClose={() => setEditProduct(null)}
          onSubmit={handleEdit}
          product={editProduct}
          isLoading={editMutation.isPending}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(v) => !v && setDeleteId(null)}
      >
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-lg">
              Delete Product?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-body text-foreground/60">
              This action cannot be undone. The product will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="admin.product.cancel_button"
              className="text-foreground/60"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="admin.product.confirm_button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

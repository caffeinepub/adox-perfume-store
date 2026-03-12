import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { ExternalBlob } from "../../backend";
import type { Product } from "../../backend";
import { parsePrice } from "../../lib/formatPrice";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  imageFile?: File;
  existingImageUrl?: string;
}

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    price: bigint;
    image?: ExternalBlob;
  }) => Promise<void>;
  product?: Product;
  isLoading?: boolean;
}

export default function ProductModal({
  open,
  onClose,
  onSubmit,
  product,
  isLoading,
}: ProductModalProps) {
  const [form, setForm] = useState<ProductFormData>({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product ? String(Number(product.price)) : "",
    existingImageUrl: product?.image?.getDirectURL(),
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file)
      setForm((p) => ({ ...p, imageFile: file, existingImageUrl: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let image: ExternalBlob | undefined;
    if (form.imageFile) {
      const bytes = new Uint8Array(await form.imageFile.arrayBuffer());
      image = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) =>
        setUploadProgress(pct),
      );
    }
    await onSubmit({
      name: form.name,
      description: form.description,
      price: parsePrice(form.price),
      image,
    });
  };

  const previewUrl = form.imageFile
    ? URL.createObjectURL(form.imageFile)
    : form.existingImageUrl;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="admin.product.modal"
        className="bg-card border-border max-w-lg"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-semibold text-foreground">
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label
              htmlFor="prod-name"
              className="font-body text-xs tracking-widest uppercase text-foreground/50 mb-2 block"
            >
              Product Name
            </label>
            <Input
              id="prod-name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Oud Noir"
              required
              className="bg-background border-border focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="prod-price"
              className="font-body text-xs tracking-widest uppercase text-foreground/50 mb-2 block"
            >
              Price (BDT)
            </label>
            <Input
              id="prod-price"
              value={form.price}
              onChange={(e) =>
                setForm((p) => ({ ...p, price: e.target.value }))
              }
              placeholder="2800"
              required
              className="bg-background border-border focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="prod-desc"
              className="font-body text-xs tracking-widest uppercase text-foreground/50 mb-2 block"
            >
              Description
            </label>
            <Textarea
              id="prod-desc"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="A brief description of this fragrance..."
              required
              rows={3}
              className="bg-background border-border focus:border-primary resize-none"
            />
          </div>

          <div>
            <p className="font-body text-xs tracking-widest uppercase text-foreground/50 mb-2">
              Product Image
            </p>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-24 h-24 object-cover border border-border mb-3"
              />
            )}
            <label htmlFor="prod-image" className="sr-only">
              Upload product image
            </label>
            <input
              id="prod-image"
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              type="button"
              data-ocid="admin.product.upload_button"
              onClick={() => fileRef.current?.click()}
              variant="outline"
              size="sm"
              className="btn-gold-outline text-xs tracking-widest uppercase flex items-center gap-2"
            >
              <Upload size={14} />
              {form.imageFile ? "Change Image" : "Upload Image"}
            </Button>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-2">
                <div className="h-1 bg-muted rounded overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              data-ocid="admin.product.cancel_button"
              variant="ghost"
              onClick={onClose}
              className="text-foreground/60 hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="admin.product.confirm_button"
              disabled={isLoading}
              className="btn-gold text-xs tracking-widest uppercase"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : product ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

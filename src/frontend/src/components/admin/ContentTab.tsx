import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, ImageIcon, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../../backend";
import { useActor } from "../../hooks/useActor";
import { useSetSiteContent } from "../../hooks/useQueries";

const CONTENT_FIELDS: {
  key: string;
  label: string;
  type: "input" | "textarea";
  defaultValue: string;
}[] = [
  {
    key: "heroHeadline",
    label: "Hero Headline",
    type: "input",
    defaultValue: "Adox \u2013 Define Your Signature Scent",
  },
  {
    key: "heroSubheading",
    label: "Hero Subheading",
    type: "textarea",
    defaultValue: "Premium perfumes crafted to express your personality.",
  },
  {
    key: "aboutTitle",
    label: "About Title",
    type: "input",
    defaultValue: "About Adox",
  },
  {
    key: "aboutText",
    label: "About Text",
    type: "textarea",
    defaultValue:
      "Adox is a premium perfume brand dedicated to crafting unforgettable scents. Each fragrance is carefully formulated to express individuality and elegance.",
  },
  {
    key: "contactText",
    label: "Contact Text",
    type: "textarea",
    defaultValue:
      "We'd love to hear from you. Reach out via the form below or connect with us on social media.",
  },
  {
    key: "footerText",
    label: "Footer Text",
    type: "input",
    defaultValue: "\u00a9 2024 Adox. All rights reserved.",
  },
];

function HeroImageField() {
  const { actor, isFetching } = useActor();
  const mutation = useSetSiteContent();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data: currentImageUrl } = useQuery<string>({
    queryKey: ["siteContent", "heroImage"],
    queryFn: async () => {
      if (!actor) return "";
      return (await actor.getSiteContent("heroImage")) ?? "";
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!actor) {
      toast.error("Not connected. Please refresh and try again.");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
        setUploadProgress(Math.round(pct * 100));
      });

      // Upload via a temporary product create/delete to get the URL
      // Actually use setSiteContent with a direct URL approach:
      // We upload by creating the blob and getting its URL
      const tempProduct = await actor.createProduct({
        name: "__temp_hero_image__",
        description: "",
        price: BigInt(0),
        image: blob,
      });

      const imageUrl = tempProduct.image
        ? tempProduct.image.getDirectURL()
        : "";

      // Delete the temp product
      await actor.deleteProduct(tempProduct.id);

      if (imageUrl) {
        await mutation.mutateAsync({ key: "heroImage", value: imageUrl });
        toast.success(
          "Hero image updated! Refresh the main page to see the change.",
        );
      } else {
        toast.error("Failed to get image URL after upload.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const previewUrl =
    currentImageUrl || "/assets/generated/hero-perfume.dim_1200x700.jpg";

  return (
    <div className="p-5 bg-background border border-border rounded-sm">
      <p className="font-body text-xs tracking-widest uppercase text-foreground/50 mb-3 block">
        Hero Background Image
      </p>

      {/* Preview */}
      <div className="relative w-full h-40 mb-3 overflow-hidden border border-border bg-muted">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Hero background"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <ImageIcon className="w-8 h-8 text-foreground/20" />
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <p className="font-body text-xs text-foreground/60">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        data-ocid="admin.content.upload_button"
      />
      <Button
        type="button"
        size="sm"
        disabled={uploading || !actor}
        onClick={() => fileInputRef.current?.click()}
        className="btn-gold text-xs tracking-widest uppercase flex items-center gap-2"
      >
        {uploading ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin" /> Uploading{" "}
            {uploadProgress}%
          </>
        ) : (
          <>
            <Upload className="h-3 w-3" /> Change Image
          </>
        )}
      </Button>
    </div>
  );
}

function ContentField({
  fieldKey,
  label,
  type,
  defaultValue,
}: {
  fieldKey: string;
  label: string;
  type: "input" | "textarea";
  defaultValue: string;
}) {
  const { actor, isFetching } = useActor();
  const { data: currentValue, isLoading } = useQuery<string>({
    queryKey: ["siteContent", fieldKey],
    queryFn: async () => {
      if (!actor) return defaultValue;
      return (await actor.getSiteContent(fieldKey)) ?? defaultValue;
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    placeholderData: defaultValue,
  });

  const [value, setValue] = useState<string | null>(null);
  const displayValue = value !== null ? value : (currentValue ?? defaultValue);
  const inputId = `content-field-${fieldKey}`;

  const mutation = useSetSiteContent();

  const handleSave = async () => {
    if (value === null) return;
    if (!actor) {
      toast.error("Not connected. Please refresh and try again.");
      return;
    }
    try {
      await mutation.mutateAsync({ key: fieldKey, value });
      toast.success(
        `${label} saved! The main page will show the update immediately.`,
      );
      setValue(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save. Please try again.");
    }
  };

  return (
    <div className="p-5 bg-background border border-border rounded-sm">
      <label
        htmlFor={inputId}
        className="font-body text-xs tracking-widest uppercase text-foreground/50 mb-3 block"
      >
        {label}
      </label>
      {isLoading ? (
        <div className="h-10 bg-muted animate-pulse rounded" />
      ) : type === "input" ? (
        <Input
          id={inputId}
          value={displayValue}
          onChange={(e) => setValue(e.target.value)}
          className="bg-card border-border focus:border-primary mb-3"
        />
      ) : (
        <Textarea
          id={inputId}
          value={displayValue}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
          className="bg-card border-border focus:border-primary mb-3 resize-none"
        />
      )}
      <Button
        type="button"
        data-ocid="admin.content.save_button"
        onClick={handleSave}
        disabled={mutation.isPending || value === null || !actor}
        size="sm"
        className="btn-gold text-xs tracking-widest uppercase"
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Saving...
          </>
        ) : (
          <>
            <CheckCircle2 className="mr-1 h-3 w-3" /> Save
          </>
        )}
      </Button>
    </div>
  );
}

export default function ContentTab() {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-xl font-semibold text-foreground mb-6">
        Edit Site Content
      </h3>
      <HeroImageField />
      {CONTENT_FIELDS.map((f) => (
        <ContentField
          key={f.key}
          fieldKey={f.key}
          label={f.label}
          type={f.type}
          defaultValue={f.defaultValue}
        />
      ))}
    </div>
  );
}

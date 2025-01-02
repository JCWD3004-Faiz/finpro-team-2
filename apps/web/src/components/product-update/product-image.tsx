"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2 } from "lucide-react";

interface ProductImageProps {
  src: string;
  index: number;
  isLoading: boolean;
  onImageChange: (file: File, index: number) => void;
  onUpdateClick: (index: number) => void;
}

export function ProductImage({
  src,
  index,
  isLoading,
  onImageChange,
  onUpdateClick,
}: ProductImageProps) {
  const [preview, setPreview] = useState(src);
  const [hasNewFile, setHasNewFile] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newPreview = URL.createObjectURL(file);
      setPreview(newPreview);
      setHasNewFile(true);
      onImageChange(file, index);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
        <Image
          src={preview}
          alt={`Product image ${index + 1}`}
          fill
          className="object-cover"
        />
        <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
          <ImagePlus className="h-8 w-8 text-white" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
      <Button
        onClick={() => onUpdateClick(index)}
        disabled={isLoading || !hasNewFile}
        className="w-full"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          'Update Image'
        )}
      </Button>
    </div>
  );
}
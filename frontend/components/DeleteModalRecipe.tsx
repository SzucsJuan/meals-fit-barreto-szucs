"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export default function DeleteModalRecipe({
  open,
  onClose,
  onConfirm,
  title = "Delete Recipe",
  message = "Are you sure you want to delete this recipe? This action cannot be undone.",
}: ConfirmDeleteModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-lg font-semibold mb-2 text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
          >
            Confirm Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

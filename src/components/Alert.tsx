import React from "react";
import { X } from "lucide-react";

interface AlertProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

export function Alert({ type, message, onClose }: AlertProps) {
  const bgColor = type === "success" ? "bg-green-50" : "bg-red-50";
  const textColor = type === "success" ? "text-green-800" : "text-red-800";
  const borderColor =
    type === "success" ? "border-green-200" : "border-red-200";

  return (
    <div className={`rounded-md p-4 ${bgColor} border ${borderColor} mb-4`}>
      <div className="flex">
        <div className="flex-1">
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            type="button"
            className={`inline-flex rounded-md ${bgColor} p-1.5 ${textColor} hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${
              type === "success" ? "green" : "red"
            }-50 focus:ring-${type === "success" ? "green" : "red"}-600`}
            onClick={onClose}
          >
            <span className="sr-only">Fechar</span>
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

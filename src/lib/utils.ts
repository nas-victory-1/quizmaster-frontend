import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Quiz } from "@/types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStatusColor = (status: Quiz["status"]) => {
  switch (status) {
    case "draft":
      return "bg-gray-100 text-gray-800";
    case "scheduled":
      return "bg-blue-100 text-blue-800";
    case "live":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusIcon = (status: Quiz["status"]) => {
  switch (status) {
    case "draft":
      return `<FileText className="h-3 w-3" />`;
    case "scheduled":
      return `<Clock className="h-3 w-3" />`;
    case "live":
      return `<Play className="h-3 w-3" />`;
    case "completed":
      return `<CheckCircle2 className="h-3 w-3" />`;
    default:
      return `<FileText className="h-3 w-3" />`;
  }
};

export const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const formatDateTime = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

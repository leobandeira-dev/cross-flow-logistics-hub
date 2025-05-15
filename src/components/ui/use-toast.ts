
import { useToast as useSonner, toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

export const toast = ({ title, description, action, variant }: ToastProps) => {
  return sonnerToast(title, {
    description,
    action,
    className: variant === "destructive" ? "destructive" : undefined,
  });
};

export const useToast = useSonner;

export type { ToastProps };

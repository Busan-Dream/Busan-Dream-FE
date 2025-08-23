import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  onConfirm?: () => void;
  variant?: "default" | "warning" | "error";
}

const AlertModal = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "확인",
  onConfirm,
  variant = "default",
}: AlertModalProps) => {
  const getTitleColor = () => {
    switch (variant) {
      case "warning":
        return "text-orange-600";
      case "error":
        return "text-red-600";
      default:
        return "";
    }
  };

  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={getTitleColor()}>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end mt-4">
          <Button onClick={handleConfirm}>{confirmText}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlertModal;

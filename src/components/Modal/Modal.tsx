import css from "./Modal.module.css";
import { createPortal } from "react-dom";
import { useEffect, type ReactNode } from "react";


interface NoteModalProps {
  children: ReactNode;
  onClose: () => void;
}

export default function MovieModal({ children, onClose }: NoteModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      onClick={handleBackdropClick}
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
    >
     
        <div className={css.modal}>{children}</div>
      
    </div>,
    document.body
  );
};

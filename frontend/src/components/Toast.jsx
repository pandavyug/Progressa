
import { useEffect } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

const Toast = ({ type = "success", message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3
      min-w-[280px] max-w-[380px] rounded-xl border p-4 shadow-xl
      animate-toast-in
      ${
        isSuccess
          ? "bg-green-50 border-green-200 text-green-700"
          : "bg-red-50 border-red-200 text-red-700"
      }`}
    >
      {isSuccess ? (
        <CheckCircle size={23} className="shrink-0" />
      ) : (
        <AlertCircle size={23} className="shrink-0" />
      )}

      <p className="flex-1 text-sm font-semibold">{message}</p>

      <button onClick={onClose} className="shrink-0">
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;

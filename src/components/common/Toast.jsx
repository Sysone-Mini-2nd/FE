import { useEffect, useState } from "react";
import { CheckCircle, Error, Warning, Info, Close } from "@mui/icons-material";

const Toast = ({
  message,
  type = "success",
  duration = 5000,
  onClose,
  position = "top-right",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  // 토스트 타입에 따른 스타일과 아이콘
  const getToastStyles = () => {
    const baseStyles = "backdrop-blur-lg border shadow-2xl";

    switch (type) {
      case "success":
        return `${baseStyles} bg-green-500/20 border-green-400/30 text-green-100`;
      case "error":
        return `${baseStyles} bg-red-500/20 border-red-400/30 text-red-100`;
      case "warning":
        return `${baseStyles} bg-yellow-500/20 border-yellow-400/30 text-yellow-100`;
      case "info":
        return `${baseStyles} bg-blue-500/20 border-blue-400/30 text-blue-100`;
      default:
        return `${baseStyles} bg-gray-500/20 border-gray-400/30 text-gray-100`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-400" />;
      case "error":
        return <Error className="text-red-400" />;
      case "warning":
        return <Warning className="text-yellow-400" />;
      case "info":
        return <Info className="text-blue-400" />;
      default:
        return <Info className="text-gray-400" />;
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case "top-left":
        return "top-4 left-4";
      case "top-center":
        return "top-4 left-1/2 transform -translate-x-1/2";
      case "top-right":
        return "top-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "bottom-center":
        return "bottom-4 left-1/2 transform -translate-x-1/2";
      case "bottom-right":
        return "bottom-4 right-4";
      default:
        return "top-4 right-4";
    }
  };

  useEffect(() => {
    // 마운트 시 애니메이션 시작
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    // duration 후 사라지기 시작
    const hideTimer = setTimeout(() => {
      setIsLeaving(true);
    }, duration - 300);

    // 완전히 사라진 후 onClose 호출
    const removeTimer = setTimeout(() => {
      onClose && onClose();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [duration, onClose]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose && onClose();
    }, 300);
  };

  return (
    <div
      className={`
        fixed z-100 ${getPositionStyles()}
        transition-all duration-300 ease-in-out
        ${
          isVisible && !isLeaving
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-2 scale-95"
        }
      `}
    >
      <div
        className={`
          ${getToastStyles()}
          rounded-2xl p-4 pr-12 min-w-80 max-w-md
          relative overflow-hidden
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-2xl" />

        {/* 메인 컨텐츠 */}
        <div className="relative flex items-center gap-3">
          {/* 아이콘 */}
          <div className="flex-shrink-0">{getIcon()}</div>

          {/* 메시지 */}
          <div className="flex-1">
            <p className="text-sm font-medium leading-relaxed">{message}</p>
          </div>
        </div>

        {/* 닫기 버튼 - 토스트 끝에 위치 */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-2 p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Close className="text-white/70 hover:text-white" />
        </button>

        {/* 프로그레스 바 */}
        <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full overflow-hidden rounded-b-2xl">
          <div
            className="h-full bg-white/40 transition-all ease-linear"
            style={{
              width: "100%",
              animation: `shrink ${duration}ms linear`,
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;

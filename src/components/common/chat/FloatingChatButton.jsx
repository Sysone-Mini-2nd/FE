import { Telegram } from '@mui/icons-material';

const FloatingChatButton = ({ onClick, unreadCount }) => {
  return (
    <button
      onClick={onClick}
      className="chatbutton relative"
    >
      <Telegram />

      {/* 배지를 버튼 안으로 이동 */}
      {unreadCount > 0 && (
        <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
          {unreadCount > 99 ? '99+' : unreadCount}
        </div>
      )}
    </button>
  );
};

export default FloatingChatButton;
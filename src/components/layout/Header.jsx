import { Notifications, Logout } from "@mui/icons-material";
import { useAuth } from '../../hooks/useAuth.jsx';

function Header() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="py-3 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-md font-semibold text-white">
            {user.name } | {user.email}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* 알림 */}
          <button className="p-2 text-white hover:bg-white/30 rounded-lg relative">
            <div className="w-5 h-5 flex items-center justify-center">
              <Notifications/>
            </div>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              ?
            </span>
          </button>
          
          {/* 사용자 메뉴 */}
          <div className="flex items-center bg-white/20 text-white rounded-xl px-4 py-2 space-x-2">
            <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-xs">
              {user?.name?.[0] || 'U'}
            </div>
            <span className="font-semibold text-sm">{user?.name || '사용자'}</span>
          </div>

          {/* 로그아웃 버튼 */}
          <button 
            onClick={handleLogout}
            className="p-2 text-white hover:bg-white/30 rounded-lg"
            title="로그아웃"
          >
            <Logout className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
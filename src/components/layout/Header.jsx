import { Notifications } from "@mui/icons-material";
import { currentUser } from '../../data/userData'
function Header() {

  return (
    <header className="py-3 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-md font-semibold text-white">
            {currentUser.name} | {currentUser.department}
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
              {currentUser.avatar}
            </div>
            <span className="font-semibold text-sm">{currentUser.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
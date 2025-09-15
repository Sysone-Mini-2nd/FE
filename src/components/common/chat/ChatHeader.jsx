import { Close, Minimize, ArrowBack } from '@mui/icons-material'
import { useAuth } from '../../../hooks/useAuth'

const ChatHeader = ({ 
  currentView, 
  selectedChat, 
  isMinimized, 
  onBackToList, 
  onToggleMinimize, 
  onToggleChat,
}) => {
  const { user } = useAuth();
  
  const getHeaderTitle = () => {
    switch (currentView) {
      case 'list': return user?.name || 'User'
      case 'chat': return selectedChat?.name
      case 'createChat': return '사원 검색'
      default: return user?.name || 'User'
    }
  }

  return (
    <div 
      className={`flex items-center justify-between p-3 bg-emerald-400/50 backdrop-blur-sm text-white rounded-t-lg border-b border-emerald-300/30 ${
        isMinimized ? 'cursor-pointer' : ''
      }`}
      onClick={isMinimized ? onToggleMinimize : undefined}
    >
      <div className="flex items-center gap-2">
        {(currentView === 'chat' || currentView === 'createChat') && !isMinimized && (
          <button
            onClick={onBackToList}
            className="p-1 hover:bg-emerald-500 rounded transition-colors"
          >
            <ArrowBack className="w-4 h-4" />
          </button>
        )}
        <div className="flex items-center gap-2">
          {currentView === 'list' && (
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user?.avatar || user?.name?.charAt(0) || 'U'}
            </div>
          )}
          <div>
            <h3 className="font-bold text-sm">{getHeaderTitle()}</h3>
            {currentView === 'list' && (
              <p className="text-xs text-emerald-100">{user?.email}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleMinimize}
          className="p-1 hover:bg-emerald-500 rounded transition-colors"
        >
          <Minimize />
        </button>
        <button
          onClick={onToggleChat}
          className="p-1 hover:bg-emerald-500 rounded transition-colors"
        >
          <Close />
        </button>
      </div>
    </div>
  )
}

export default ChatHeader

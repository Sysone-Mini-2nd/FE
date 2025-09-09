import { Close, Minimize, ArrowBack } from '@mui/icons-material'
import { currentUser } from '../../../data/userData'

const ChatHeader = ({ 
  currentView, 
  selectedChat, 
  isMinimized, 
  onBackToList, 
  onToggleMinimize, 
  onToggleChat 
}) => {
  const getHeaderTitle = () => {
    switch (currentView) {
      case 'list': return currentUser.name
      case 'chat': return selectedChat?.name
      case 'createChat': return '사원 검색'
      default: return currentUser.name
    }
  }

  return (
    <div 
      className={`flex items-center justify-between p-3 bg-emerald-400/50 text-white rounded-t-lg ${
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
              {currentUser.avatar}
            </div>
          )}
          <div>
            <h3 className="font-bold text-sm">{getHeaderTitle()}</h3>
            {currentView === 'list' && (
              <p className="text-xs text-emerald-100">{currentUser.email}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleMinimize}
          className="p-1 hover:bg-emerald-500 rounded transition-colors"
        >
          <Minimize className="w-4 h-4" />
        </button>
        <button
          onClick={onToggleChat}
          className="p-1 hover:bg-emerald-500 rounded transition-colors"
        >
          <Close className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default ChatHeader

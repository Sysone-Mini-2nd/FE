import { useEffect, useRef } from 'react'
import { Send } from '@mui/icons-material'
import useChatStore from '../../../store/chatStore'
import { useAuth } from '../../../hooks/useAuth'

const ChatRoom = ({ 
  selectedChat, 
  message, 
  onMessageChange, 
  onSendMessage 
}) => {
  const messagesEndRef = useRef(null)
  const { user } = useAuth()
  
  // Zustand store에서 메시지 가져오기
  const { getMessages } = useChatStore()
  const messages = getMessages(selectedChat?.id || 0)

  // 새 메시지가 추가될 때마다 스크롤을 맨 아래로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 시간 포맷팅
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex flex-col h-full bg-white/50 rounded-b-lg">
      {/* 메시지 영역 */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50/30 min-h-0">
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p>{selectedChat?.name}님과의 채팅을 시작해보세요!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === user?.name ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`p-3 rounded-lg shadow-sm max-w-xs ${
                  msg.sender === user?.name 
                    ? 'bg-emerald-400/50 backdrop-blur-lg text-white' 
                    : 'bg-white'
                }`}>
                  {msg.sender !== user?.name && (
                    <p className="text-xs text-gray-600 mb-1 font-medium">{msg.sender}</p>
                  )}
                  <p className="text-sm">{msg.text}</p>
                  <span className={`text-xs ${
                    msg.sender === user?.name ? 'text-emerald-100' : 'text-gray-500'
                  }`}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 메시지 입력 영역 */}
      <div className="flex-shrink-0">
        <form onSubmit={onSendMessage} className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="px-3 py-2 bg-emerald-400 text-white rounded-lg hover:bg-emerald-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChatRoom

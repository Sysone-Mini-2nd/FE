import React from 'react'
import { Send } from '@mui/icons-material'

const ChatRoom = ({ 
  selectedChat, 
  message, 
  onMessageChange, 
  onSendMessage 
}) => {
  return (
    <>
      <div className="flex-1 p-4 h-[460px] overflow-y-auto bg-gray-50/50">
        <div className="space-y-3">
          {/* 샘플 메시지 */}
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs">
              <p className="text-sm">{selectedChat?.name}과의 채팅</p>
              <span className="text-xs text-gray-500">오후 2:30</span>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-emerald-400 text-white p-3 rounded-lg shadow-sm max-w-xs">
              <p className="text-sm">{message}</p>
              <span className="text-xs text-emerald-100">시간</span>
            </div>
          </div>
        </div>
      </div>

      {/* 메시지 입력 영역 */}
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
            className="px-3 py-2 bg-emerald-400 text-white rounded-lg hover:bg-emerald-500 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </>
  )
}

export default ChatRoom

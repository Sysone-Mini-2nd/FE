import React, { useState } from 'react'
import { Telegram, Close, Send, Minimize } from '@mui/icons-material'

function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState('')

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
  }

  const minimizeChat = () => {
    setIsMinimized(true)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim()) {
      console.log('메시지 전송:', message)
      setMessage('')
    }
  }

  return (
    <>
      {/* 플로팅 채팅 아이콘 */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-emerald-400/30 hover:bg-emerald-400/50 backdrop-blur-xs text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
        >
          <Telegram className="w-6 h-6" />
        </button>
      )}

      {/* 채팅 창 */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-300 ${
          isMinimized ? 'w-80 h-12' : 'w-80 h-96'
        }`}>
          {/* 채팅 헤더 */}
          <div className="flex items-center justify-between p-3 bg-emerald-300 text-white rounded-t-lg">
            <h3 className="font-medium">메신저</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={minimizeChat}
                className="p-1 hover:bg-emerald-400 rounded transition-colors"
              >
                <Minimize className="w-4 h-4" />
              </button>
              <button
                onClick={toggleChat}
                className="p-1 hover:bg-emerald-400 rounded transition-colors"
              >
                <Close className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 채팅 내용 (최소화되지 않았을 때만 표시) */}
          {!isMinimized && (
            <>
              {/* 메시지 영역 */}
              <div className="flex-1 p-4 h-64 overflow-y-auto bg-gray-50">
                <div className="space-y-3">
                  {/* 샘플 메시지 */}
                  <div className="flex justify-start">
                    <div className="bg-white p-2 rounded-lg shadow-sm max-w-xs">
                      <p className="text-sm">시스원 ㅎㅇㅎㅇ</p>
                      <span className="text-xs text-gray-500">오후 2:30</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 메시지 입력 영역 */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400 text-sm"
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
          )}
        </div>
      )}
    </>
  )
}

export default FloatingChat

import React, { useState } from 'react'
import { Telegram, Close, Send, Minimize, ArrowBack, Person, Group } from '@mui/icons-material'

function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState('')
  const [currentView, setCurrentView] = useState('list') // 'list' 또는 'chat'
  const [selectedChat, setSelectedChat] = useState(null)

  // 샘플 채팅방 데이터
  const chatRooms = [
    {
      id: 1,
      name: '프로젝트 팀',
      type: 'group',
      lastMessage: '회의 자료 확인했습니다.',
      lastTime: '오후 3:45',
      unreadCount: 2,
      participants: ['김개발', '이디자인', '박기획']
    },
    {
      id: 2,
      name: '김개발',
      type: 'private',
      lastMessage: '내일 코드리뷰 어떠세요?',
      lastTime: '오후 2:30',
      unreadCount: 1,
      participants: ['김개발']
    },
    {
      id: 3,
      name: '시스원 전체',
      type: 'group',
      lastMessage: '회사 공지사항이 업데이트되었습니다.',
      lastTime: '오전 10:15',
      unreadCount: 0,
      participants: ['김개발', '이디자인', '박기획', '최관리', '정사업']
    },
    {
      id: 4,
      name: '이디자인',
      type: 'private',
      lastMessage: 'UI 수정 완료했어요!',
      lastTime: '어제',
      unreadCount: 0,
      participants: ['이디자인']
    }
  ]

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
    if (!isOpen) {
      setCurrentView('list')
      setSelectedChat(null)
    }
  }

  const selectChatRoom = (chatRoom) => {
    setSelectedChat(chatRoom)
    setCurrentView('chat')
  }

  const backToList = () => {
    setCurrentView('list')
    setSelectedChat(null)
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
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
        <div className={`fixed bottom-6 right-6 z-50 rounded-lg shadow-xl border border-gray-200 backdrop-blur-md bg-white/10 transition-all duration-300 ${
          isMinimized ? 'w-80 h-12' : 'w-80 h-140'
        }`}>
          {/* 채팅 헤더 */}
          <div 
            className={`flex items-center justify-between p-3 bg-emerald-300/40 text-gray-500 rounded-t-lg ${
              isMinimized ? 'cursor-pointer hover:bg-emerald-300/50' : ''
            }`}
            onClick={isMinimized ? toggleMinimize : undefined}
          >
            <div className="flex items-center gap-2">
              {currentView === 'chat' && !isMinimized && (
                <button
                  onClick={backToList}
                  className="p-1 hover:bg-emerald-400 rounded transition-colors"
                >
                  <ArrowBack className="w-4 h-4" />
                </button>
              )}
              <h3 className="font-bold">
                {currentView === 'list' ? '메신저' : selectedChat?.name}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMinimize}
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

          {/* 채팅 내용 */}
          {!isMinimized && (
            <>
              {currentView === 'list' ? (
                /* 채팅방 목록 */
                <div className="h-110 overflow-y-auto bg-white/20">
                  <div className="p-2">
                    {chatRooms.map((room) => (
                      <div
                        key={room.id}
                        onClick={() => selectChatRoom(room)}
                        className="flex items-center p-3 hover:bg-white/50 rounded-lg cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="w-10 h-10 bg-emerald-400 rounded-full flex items-center justify-center mr-3">
                          {room.type === 'group' ? (
                            <Group className="w-5 h-5 text-white" />
                          ) : (
                            <Person className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-gray-800 truncate">{room.name}</h4>
                            <span className="text-xs text-gray-500">{room.lastTime}</span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{room.lastMessage}</p>
                          {room.type === 'group' && (
                            <p className="text-xs text-gray-400">
                              {room.participants.join(', ')}
                            </p>
                          )}
                        </div>
                        {room.unreadCount > 0 && (
                          <div className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center ml-2">
                            {room.unreadCount}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* 채팅방 화면 */
                <>
                  <div className="flex-1 p-4 h-110 overflow-y-auto bg-gray-50/20">
                    <div className="space-y-3">
                      {/* 샘플 메시지 */}
                      <div className="flex justify-start">
                        <div className="bg-white p-2 rounded-lg shadow-sm max-w-xs">
                          <p className="text-sm">{selectedChat?.name}과의 채팅</p>
                          <span className="text-xs text-gray-500">오후 2:30</span>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-emerald-400 text-white p-2 rounded-lg shadow-sm max-w-xs">
                          <p className="text-sm">안녕하세요!</p>
                          <span className="text-xs text-emerald-100">오후 2:31</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 메시지 입력 영역 */}
                  <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white/20 rounded-b-lg">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="메시지를 입력하세요..."
                        className="flex-1 px-3 py-2 border border-gray-300 bg-white/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400 text-sm"
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
            </>
          )}
        </div>
      )}
    </>
  )
}

export default FloatingChat

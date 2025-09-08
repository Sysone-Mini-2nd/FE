import { useState } from 'react'
import useChatStore from '../../store/chatStore'

export const useChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState('')
  const [currentView, setCurrentView] = useState('list') // 'list', 'chat', 'createChat'
  const [selectedChat, setSelectedChat] = useState(null)

  // Zustand store 사용
  const { sendMessage, markAsRead } = useChatStore()

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
    // 채팅방 선택 시 읽음 처리
    markAsRead(chatRoom.id)
  }

  const backToList = () => {
    setCurrentView('list')
    setSelectedChat(null)
  }

  const goToCreateChat = () => {
    setCurrentView('createChat')
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim() && selectedChat) {
      // Zustand store를 통해 메시지 전송
      sendMessage(selectedChat.id, message.trim())
      setMessage('')
      
      // 시뮬레이션: 2초 후 상대방 응답
      setTimeout(() => {
        const responses = [
          '네, 알겠습니다!',
          '확인했습니다.',
          '좋은 아이디어네요.',
          '언제 시간 되시나요?',
          '회의실 예약해두겠습니다.'
        ]
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        
        // 상대방 이름 (첫 번째 참가자를 상대방으로 가정)
        const otherParticipant = selectedChat.participants.find(p => p !== '현재사용자') || selectedChat.name
        
        useChatStore.getState().receiveMessage(selectedChat.id, randomResponse, otherParticipant)
      }, 2000)
    }
  }

  return {
    isOpen,
    isMinimized,
    message,
    setMessage,
    currentView,
    selectedChat,
    toggleChat,
    selectChatRoom,
    backToList,
    goToCreateChat,
    toggleMinimize,
    handleSendMessage
  }
}

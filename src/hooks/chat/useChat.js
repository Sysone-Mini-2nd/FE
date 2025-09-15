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
    // 채팅방 선택 시 읽음 처리 (마지막 메시지 ID를 전달해야 함)
    // TODO: ChatRoom.jsx에서 마지막 메시지 ID를 가져와 markAsRead 호출 시 전달하도록 수정 필요
    markAsRead(chatRoom.id, null) // 임시로 null 전달
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
      // Zustand store를 통해 메시지 전송 (WebSocket 사용)
      sendMessage(selectedChat.id, message.trim())
      setMessage('')
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

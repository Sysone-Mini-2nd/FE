import { useState } from 'react'

export const useChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState('')
  const [currentView, setCurrentView] = useState('list') // 'list', 'chat', 'createChat'
  const [selectedChat, setSelectedChat] = useState(null)

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

  const goToCreateChat = () => {
    setCurrentView('createChat')
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

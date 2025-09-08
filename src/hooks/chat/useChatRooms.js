import { useState } from 'react'
import useChatStore from '../../store/chatStore'

export const useChatRooms = () => {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Zustand store 사용
  const { chatRooms, addChatRoom: addChatRoomToStore } = useChatStore()

  const addChatRoom = (newChat) => {
    addChatRoomToStore(newChat)
  }

  const findExistingPrivateChat = (employeeName) => {
    return chatRooms.find(room => 
      room.type === 'private' && room.name === employeeName
    )
  }

  const filteredChatRooms = chatRooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return {
    chatRooms,
    searchTerm,
    setSearchTerm,
    addChatRoom,
    findExistingPrivateChat,
    filteredChatRooms
  }
}

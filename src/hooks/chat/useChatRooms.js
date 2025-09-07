import { useState } from 'react'
import { initialChatRooms } from '../../data/chatRooms'

export const useChatRooms = () => {
  const [chatRooms, setChatRooms] = useState(initialChatRooms)
  const [searchTerm, setSearchTerm] = useState('')

  const addChatRoom = (newChat) => {
    setChatRooms(prev => [...prev, newChat])
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

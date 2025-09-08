import { create } from 'zustand'
import { chatRoomsData } from '../data/chatRooms'

const useChatStore = create((set, get) => ({
  // 채팅방 목록
  chatRooms: chatRoomsData,
  
  // 각 채팅방의 메시지들 (chatRoomId를 key로 하는 객체)
  messages: {
    // 예시: { 1: [message1, message2], 2: [message3, message4] }
  },

  // 현재 사용자 (임시)
  currentUser: { name: '현재사용자', id: 'current' },

  // 채팅방 추가
  addChatRoom: (newChatRoom) => set((state) => ({
    chatRooms: [newChatRoom, ...state.chatRooms],
    messages: { ...state.messages, [newChatRoom.id]: [] }
  })),

  // 메시지 전송
  sendMessage: (chatRoomId, messageText) => {
    const { currentUser } = get()
    const newMessage = {
      id: Date.now(),
      text: messageText,
      sender: currentUser.name,
      senderId: currentUser.id,
      timestamp: new Date().toISOString(),
      type: 'text'
    }

    set((state) => {
      const updatedMessages = {
        ...state.messages,
        [chatRoomId]: [...(state.messages[chatRoomId] || []), newMessage]
      }

      // 채팅방의 lastMessage도 업데이트
      const updatedChatRooms = state.chatRooms.map(room => 
        room.id === chatRoomId 
          ? { 
              ...room, 
              lastMessage: messageText,
              lastTime: new Date().toLocaleTimeString('ko-KR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })
            }
          : room
      )

      return {
        messages: updatedMessages,
        chatRooms: updatedChatRooms
      }
    })

    return newMessage
  },

  // 특정 채팅방의 메시지 가져오기
  getMessages: (chatRoomId) => {
    const { messages } = get()
    return messages[chatRoomId] || []
  },

  // 채팅방 찾기
  findChatRoom: (participantName) => {
    const { chatRooms } = get()
    return chatRooms.find(room => 
      room.type === 'private' && 
      room.participants.includes(participantName)
    )
  },

  // 받은 메시지 추가 (다른 사용자로부터)
  receiveMessage: (chatRoomId, messageText, senderName) => {
    const newMessage = {
      id: Date.now(),
      text: messageText,
      sender: senderName,
      senderId: senderName,
      timestamp: new Date().toISOString(),
      type: 'text'
    }

    set((state) => {
      const updatedMessages = {
        ...state.messages,
        [chatRoomId]: [...(state.messages[chatRoomId] || []), newMessage]
      }

      const updatedChatRooms = state.chatRooms.map(room => 
        room.id === chatRoomId 
          ? { 
              ...room, 
              lastMessage: messageText,
              lastTime: new Date().toLocaleTimeString('ko-KR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }),
              unreadCount: room.unreadCount + 1
            }
          : room
      )

      return {
        messages: updatedMessages,
        chatRooms: updatedChatRooms
      }
    })
  },

  // 읽음 처리
  markAsRead: (chatRoomId) => set((state) => ({
    chatRooms: state.chatRooms.map(room => 
      room.id === chatRoomId 
        ? { ...room, unreadCount: 0 }
        : room
    )
  }))
}))

export default useChatStore

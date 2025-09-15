import { create } from 'zustand';

const useChatStore = create((set, get) => ({
  // --- STATE ---
  chatRooms: [],
  messages: {}, // { [chatRoomId]: ChatMessageResponseDto[] }
  totalUnreadCount: 0,
  currentUser: null,

  // --- ACTIONS ---

  // 현재 사용자 정보 설정 (최초 1회)
  setCurrentUser: (user) => set({ currentUser: user }),

  // 채팅방 목록 전체 설정
  setChatRooms: (rooms) => set({ chatRooms: rooms }),

  // 특정 채팅방 메시지 목록 설정
  setMessages: (roomId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [roomId]: messages },
    })),

  // 채팅방 퇴장 시 목록에서 제거
  removeChatRoom: (roomId) =>
    set((state) => ({
      chatRooms: state.chatRooms.filter((room) => room.id !== roomId),
    })),

  // 전체 안 읽은 메시지 개수 설정
  setTotalUnreadCount: (count) => set({ totalUnreadCount: count }),

  // 특정 방 안 읽은 개수 리셋
  resetUnreadCount: (roomId) =>
    set((state) => {
      const roomToReset = state.chatRooms.find((room) => room.id === roomId);
      if (!roomToReset || !roomToReset.unreadMessageCount) return {};

      const countToSubtract = roomToReset.unreadMessageCount;
      return {
        chatRooms: state.chatRooms.map((room) =>
          room.id === roomId ? { ...room, unreadMessageCount: 0 } : room
        ),
        totalUnreadCount: Math.max(0, state.totalUnreadCount - countToSubtract),
      };
    }),

  // --- GETTERS ---
  getMessages: (chatRoomId) => get().messages[chatRoomId] || [],

  // --- 실시간 메시지 처리 ---
  addMessage: (roomId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: [...(state.messages[roomId] || []), message],
      },
    })),

  updateMessage: (roomId, updatedMessage) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: state.messages[roomId].map((msg) =>
          msg.id === updatedMessage.id ? { ...msg, ...updatedMessage } : msg
        ),
      },
    })),
}));

export default useChatStore;

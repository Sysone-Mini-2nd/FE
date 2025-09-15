import { create } from 'zustand';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

let stompClient = null;
let subscriptions = {};

const useChatStore = create((set, get) => ({
  chatRooms: [],
  messages: {},
  totalUnreadCount: 0,
  currentUser: null,
  isConnected: false,

  setCurrentUser: (user) => {
    set({ currentUser: user });

    // Removed duplicate subscription logic to avoid redundancy
  },
  setChatRooms: (rooms) => set({ chatRooms: rooms }),
  setMessages: (roomId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [roomId]: messages },
    })),
  removeChatRoom: (roomId) =>
    set((state) => ({
      chatRooms: state.chatRooms.filter((room) => room.id !== roomId),
    })),
  setTotalUnreadCount: (count) => set({ totalUnreadCount: count }),
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
  getMessages: (chatRoomId) => get().messages[chatRoomId] || [],

  connectWebSocket: (userId) => {
    if (!userId) {
      console.error('Cannot connect WebSocket: userId is missing.');
      return;
    }
    if (stompClient && stompClient.connected) {
      set({ isConnected: true });
      get().unsubscribeAll();
      return;
    }
    const socket = new SockJS('http://localhost:8081/ws/chat');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      set({ isConnected: true });

      // Subscribe to total unread messages immediately after connection
      if (!subscriptions.totalUnread) {
        subscriptions.totalUnread = stompClient.subscribe('/user/queue/total-unread/' + userId, (message) => {
          const totalUnreadCountDto = JSON.parse(message.body);
          get().setTotalUnreadCount(totalUnreadCountDto.totalUnreadCount);
        });
      }
    }, () => {
      set({ isConnected: false });
    });
  },

  disconnectWebSocket: () => {
    if (stompClient) {
      get().unsubscribeAll();
      stompClient.disconnect(() => {
        set({ isConnected: false });
      });
    }
  },

  subscribeToChatRoom: (chatRoomId) => {
    get().unsubscribeAll();
    if (chatRoomId) {
      subscriptions.message = stompClient.subscribe('/topic/chatroom/' + chatRoomId, (message) => {
        const receivedMessage = JSON.parse(message.body);
        get().addMessage(receivedMessage.chatRoomId, receivedMessage);

        // 수신한 메시지가 내가 보낸 것이 아니라면 즉시 읽음 처리
        const currentUser = get().currentUser;
        if (currentUser && receivedMessage.senderId !== currentUser.id) {
          get().markAsRead(receivedMessage.chatRoomId, receivedMessage.id);
        }
      });

      subscriptions.readEvent = stompClient.subscribe('/topic/chat/' + chatRoomId + '/read', (message) => {
        const readEvent = JSON.parse(message.body);

        // 특정 메시지의 readCount 감소 처리
        const roomId = chatRoomId;
        get().updateMessage(roomId, {
          id: readEvent.messageId,
          readCountUpdater: (prev) => Math.max(0, prev - 1),
        });
      });
    }
  },

  unsubscribeAll: () => {
    for (const key in subscriptions) {
      if (subscriptions[key]) {
        subscriptions[key].unsubscribe();
        subscriptions[key] = null;
      }
    }
  },

  sendMessage: (roomId, content) => {
    if (stompClient && stompClient.connected) {
      const currentUser = get().currentUser;
      if (!currentUser || !currentUser.id) return;
      const chatMessage = {
        chatRoomId: roomId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        content: content,
        type: 'TEXT',
      };
      stompClient.send('/app/send', {}, JSON.stringify(chatMessage));
    }
  },

  markAsRead: (roomId, messageId) => {
    if (stompClient && stompClient.connected) {
      const currentUser = get().currentUser;
      if (!currentUser || !currentUser.id) return;
      const messageReadRequest = {
        memberId: currentUser.id,
        chatRoomId: roomId,
        messageId: messageId,
      };
      stompClient.send('/app/message/read', {}, JSON.stringify(messageReadRequest));
      get().resetUnreadCount(roomId);
    }
  },

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
        [roomId]: state.messages[roomId].map((msg) => {
          if (msg.id !== updatedMessage.id) return msg;
          if (updatedMessage.readCountUpdater) {
            return {
              ...msg,
              readCount: updatedMessage.readCountUpdater(msg.readCount),
            };
          }
          return { ...msg, ...updatedMessage };
        }),
      },
    })),
}));

export default useChatStore;
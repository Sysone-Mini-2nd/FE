import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import useChatStore from '../../store/chatStore';
import * as chatApi from '../../api/chatApi';
import * as socketService from '../../api/socketService';
import { useDebounce } from '../useDebounce';
/** 작성자: 김대호, 조윤상 */
export const useFloatingChat = () => {
  const { user } = useAuth();
  const {
    chatRooms, setChatRooms, setMessages, addMessage, updateMessage,
    setTotalUnreadCount, resetUnreadCount, setCurrentUser, removeChatRoom, totalUnreadCount
  } = useChatStore();

  // --- UI State ---
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentView, setCurrentView] = useState('list');
  const [selectedChat, setSelectedChat] = useState(null);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, roomId: null });
  const [isSocketConnected, setIsSocketConnected] = useState(false); // 소켓 연결 상태

  // --- Form State ---
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
  const [groupName, setGroupName] = useState('');
  
  // --- Data State ---
  const [allEmployees, setAllEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const debouncedSearchTerm = useDebounce(employeeSearchTerm, 500);

  // --- WebSocket Connection & Initial Data Fetching ---
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      // 로그인하면 바로 전체 안읽은 개수 가져오기 (REST API)
      chatApi.fetchTotalUnreadCount().then(response => setTotalUnreadCount(response.data.data.totalUnreadCount));
      
      // WebSocket 연결 시작
      socketService.connectWebSocket(() => {
        setIsSocketConnected(true); // 연결 성공 시 상태만 변경
      });
    }
    return () => {
      socketService.disconnectWebSocket();
      setIsSocketConnected(false);
    };
  }, [user, setCurrentUser, setTotalUnreadCount]);

  // --- WebSocket Subscriptions (연결 상태에 따라 구독) ---
  useEffect(() => {
    if (isSocketConnected) {
      const subscription = socketService.subscribe('/topic/update', async (message) => {
        try {
          console.log('Received update message:', message);
          const { totalUnreadCount, memberId } = message;
          if (memberId === user?.id && totalUnreadCount !== undefined) {
            setTotalUnreadCount(totalUnreadCount);
          }
          const response = await chatApi.fetchChatRooms();
          const chatRoomsData = Array.isArray(response.data.data) ? response.data.data : [];
          setChatRooms(chatRoomsData);
        } catch (error) {
          console.error('Failed to process update message or fetch chat rooms:', error);
        }
      });

      return () => {
        if (subscription) {
          socketService.unsubscribe('/topic/update');
        }
      };
    }
  }, [isSocketConnected, setChatRooms, setTotalUnreadCount, user]);

  // --- Chat Window Open Logic ---
  useEffect(() => {
    if (isOpen && user) {
      chatApi.fetchChatRooms().then(response => {
        const chatRoomsData = Array.isArray(response.data.data) ? response.data.data : [];
        setChatRooms(chatRoomsData);
      });
    }
  }, [isOpen, user, setChatRooms]);

  // --- 이전 메시지 로딩 및 읽음 처리 ---
  useEffect(() => {
    if (selectedChat) {
      chatApi.fetchMessages(selectedChat.id).then(response => {
        const messages = response.data.data;
        setMessages(selectedChat.id, messages);
        if (messages && messages.length > 0 && selectedChat.unreadMessageCount > 0) {
          const lastMessageId = messages[messages.length - 1].id;
          chatApi.markAllAsRead(selectedChat.id, lastMessageId).then(() => {
            chatApi.fetchTotalUnreadCount().then(res => setTotalUnreadCount(res.data.data.totalUnreadCount));
          });
        }
      });
    }
  }, [selectedChat, setMessages, setTotalUnreadCount]);

  // --- 실시간 메시지 구독 ---
  useEffect(() => {
    let subscription;
    if (selectedChat && isSocketConnected) {
      subscription = socketService.subscribeToChatRoom(selectedChat.id, (newMessage) => {
        if (newMessage.type === 'DELETED') {
          updateMessage(selectedChat.id, newMessage);
        } else {
          addMessage(selectedChat.id, newMessage);
        }
      });
    }
    return () => {
      if (subscription && selectedChat) {
        socketService.unsubscribe(`/topic/chatroom/${selectedChat.id}`);
      }
    };
  }, [selectedChat, isSocketConnected, addMessage, updateMessage]);

  // --- Employee Search Logic ---
  useEffect(() => {
    if (currentView === 'createChat') {
      const promise = debouncedSearchTerm ? chatApi.searchMembers(debouncedSearchTerm) : chatApi.fetchAllMembers();
      promise.then(response => setAllEmployees(response.data.data));
    }
  }, [debouncedSearchTerm, currentView]);

  // --- Event Handlers (이하 동일) ---
  const toggleChat = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  const backToList = useCallback(() => {
    setSelectedChat(null);
    setCurrentView('list');
  }, [setSelectedChat, setCurrentView]);

  const selectChatRoom = (room) => {
    setSelectedChat(room);
    setCurrentView('chat');
    resetUnreadCount(room.id);
  };

  const handleGoToCreateChat = () => {
    setSelectedEmployees([]);
    setEmployeeSearchTerm('');
    setGroupName('');
    setCurrentView('createChat');
  };

  const handleToggleEmployee = (employee) => {
    setSelectedEmployees(prev => 
      prev.some(e => e.id === employee.id)
        ? prev.filter(e => e.id !== employee.id)
        : [...prev, employee]
    );
  };

  const handleCreateGroupChat = async () => {
    if (selectedEmployees.length === 0) return;
    const memberIdList = selectedEmployees.map(e => e.id);
    if (user && !memberIdList.includes(user.id)) {
        memberIdList.push(user.id);
    }
    let roomName, type;
    if (memberIdList.length <= 2 && selectedEmployees.length === 1) {
      type = 'One_On_One';
      roomName = selectedEmployees[0].name;
    } else {
      if (!groupName.trim()) { alert('그룹 채팅방 이름을 입력해주세요.'); return; }
      type = 'Group';
      roomName = groupName;
    }
    try {
      console.log('--- Debugging Chat Room Creation ---');
      console.log('Current User (creator):', user);
      console.log('Selected Employees (from UI):', selectedEmployees);
      console.log('memberIdList (sent to backend):', memberIdList);
      console.log('Calculated roomName (for 1:1):', roomName);
      console.log('Type:', type);
      console.log('------------------------------------');
      await chatApi.createChatRoom(memberIdList, roomName, type);
      const response = await chatApi.fetchChatRooms();
      const chatRoomsData = Array.isArray(response.data.data) ? response.data.data : [];
      setChatRooms(chatRoomsData);
      backToList();
    } catch (error) {
      console.error('Failed to create chat room:', error);
    }
  };

  const handleContextMenu = useCallback((event, room) => {
    event.preventDefault();
    setContextMenu({ visible: true, x: event.clientX, y: event.clientY, roomId: room.id });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, []);

  const handleLeaveChatRoom = useCallback(async () => {
    if (!contextMenu.roomId) return;
    try {
      await chatApi.leaveChatRoom(contextMenu.roomId);
      removeChatRoom(contextMenu.roomId);
      if (selectedChat?.id === contextMenu.roomId) {
        backToList();
      }
    } catch (error) {
      console.error("Failed to leave chat room:", error);
    } finally {
      closeContextMenu();
    }
  }, [contextMenu.roomId, selectedChat, removeChatRoom, backToList, closeContextMenu]);

  const handleSendMessage = useCallback((e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat || !user) return;
    const messageDto = {
      chatRoomId: selectedChat.id,
      senderId: user.id,
      content: message,
      type: 'TEXT'
    };
    socketService.sendMessage(messageDto);
    setMessage('');
  }, [message, selectedChat, user, setMessage]);

  const filteredChatRooms = useMemo(() => {
    const validChatRooms = Array.isArray(chatRooms) ? chatRooms : [];
    return validChatRooms.filter(room => 
      room.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [chatRooms, searchTerm]);

  useEffect(() => {
    console.log('Filtered Chat Rooms Updated:', filteredChatRooms);
  }, [filteredChatRooms]);

  return {
    isOpen, isMinimized, message, setMessage, currentView, selectedChat, searchTerm, setSearchTerm,
    employeeSearchTerm, setEmployeeSearchTerm, selectedEmployees, filteredEmployees: allEmployees,
    groupName, setGroupName, filteredChatRooms, contextMenu, totalUnreadCount,
    toggleChat, toggleMinimize, selectChatRoom, backToList, handleGoToCreateChat,
    handleToggleEmployee, handleCreateGroupChat, handleContextMenu, closeContextMenu, handleLeaveChatRoom,
    handleSendMessage
  };
};
import api from './client';

// --- ChatRoomController API ---

// 모든 채팅방 목록 가져오기
export const fetchChatRooms = () => api.get('/chat-room/all');

// 특정 채팅방의 메시지 내역 가져오기 (페이지네이션)
export const fetchMessages = (chatRoomId, page = 0, size = 50) =>
    api.get(`/chat-room/${chatRoomId}/messages`, { params: { page, size } });

// 채팅방 생성
export const createChatRoom = (memberIdList, roomName, type) =>
    api.post('/chat-room/create', { memberIdList, name: roomName, type });

// 채팅방에 사용자 초대
export const inviteToChatRoom = (chatRoomId, memberIdList) =>
    api.post(`/chat-room/${chatRoomId}/invite`, { memberIdList });

// 이미 존재하는 채팅방에 멤버 추가
export const addMembersToExistingChatRoom = (chatRoomId, memberIdList) =>
    api.post(`/chat-room/${chatRoomId}/add-members`, { chatRoomId, memberIdList });

// 메시지 삭제
export const deleteMessage = (messageId) => api.delete(`/chat-room/messages/${messageId}`);

// 채팅방 퇴장
export const leaveChatRoom = (chatRoomId) => api.delete(`/chat-room/delete/${chatRoomId}`);

// 전체 안 읽은 메시지 개수 조회
export const fetchTotalUnreadCount = () => api.get('/chat-room/total-unread-count');

// 특정 채팅방 메시지 모두 읽음 처리
export const markAllAsRead = (chatRoomId, lastReadMessageId) =>
  api.get(`/chat-room/${chatRoomId}/mark-all-as-read`, { params: { lastReadMessageId } });

// --- MemberProfileController API ---

// 모든 사용자 프로필 조회
export const fetchAllMembers = () => api.get('/profile/all');

// 이름 또는 이메일로 사용자 검색
export const searchMembers = (keyword) => api.get('/profile/search', { params: { keyword } });

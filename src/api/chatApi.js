import api from './client';
/** 작성자: 조윤상 */
// 공통 API 호출 함수
const apiCall = (method, url, data = null, params = null) => {
  return api({
    method,
    url,
    data,
    params,
  });
};

// --- ChatRoomController API ---

// 모든 채팅방 목록 가져오기
export const fetchChatRooms = () => apiCall('get', '/chat-room/all');

// 특정 채팅방의 메시지 내역 가져오기 (페이지네이션)
export const fetchMessages = (chatRoomId, page = 0, size = 50) =>
  apiCall('get', `/chat-room/${chatRoomId}/messages`, null, { page, size });

// 채팅방 생성
export const createChatRoom = (memberIdList, roomName, type) =>
  apiCall('post', '/chat-room/create', { memberIdList, name: roomName, type });

// 채팅방에 사용자 초대
export const inviteToChatRoom = (chatRoomId, memberIdList) =>
  apiCall('post', `/chat-room/${chatRoomId}/invite`, { memberIdList });

// 이미 존재하는 채팅방에 멤버 추가
export const addMembersToExistingChatRoom = (chatRoomId, memberIdList) =>
  apiCall('post', `/chat-room/${chatRoomId}/add-members`, { chatRoomId, memberIdList });

// 메시지 삭제
export const deleteMessage = (messageId) =>
  apiCall('delete', `/chat-room/messages/${messageId}`);

// 채팅방 퇴장
export const leaveChatRoom = (chatRoomId) =>
  apiCall('delete', `/chat-room/delete/${chatRoomId}`);

// 전체 안 읽은 메시지 개수 조회
export const fetchTotalUnreadCount = () => apiCall('get', '/chat-room/total-unread-count');

// 특정 채팅방 메시지 모두 읽음 처리
export const markAllAsRead = (chatRoomId, lastReadMessageId) =>
  apiCall('get', `/chat-room/${chatRoomId}/mark-all-as-read`, null, { lastReadMessageId });

// --- MemberProfileController API ---

// 모든 사용자 프로필 조회
export const fetchAllMembers = () => api.get('/profile/all');

// 이름 또는 이메일로 사용자 검색
export const searchMembers = (keyword) => api.get('/profile/search', { params: { keyword } });

import api from './client';
/** 작성자: 김대호 */
// 회원 목록 조회
export const getMembers = async () => {
  try {
    const response = await api.get('/members');
    return response.data;
  } catch (error) {
    console.error('회원 목록 조회 실패:', error);
    throw error;
  }
};

// 회원 등록
export const createMember = async (memberData) => {
  try {
    const response = await api.post('/members', memberData);
    return response.data;
  } catch (error) {
    console.error('회원 등록 실패:', error);
    throw error;
  }
};

// 회원 상세 조회
export const getMemberDetail = async (memberId) => {
  try {
    const response = await api.get(`/members/${memberId}`);
    return response.data;
  } catch (error) {
    console.error('회원 상세 조회 실패:', error);
    throw error;
  }
};

// 회원 정보 수정
export const updateMember = async (memberId, memberData) => {
  try {
    const response = await api.put(`/members/${memberId}`, memberData);
    return response.data;
  } catch (error) {
    console.error('회원 정보 수정 실패:', error);
    throw error;
  }
};

// 회원 삭제
export const deleteMember = async (memberId) => {
  try {
    const response = await api.delete(`/members/${memberId}`);
    return response.data;
  } catch (error) {
    console.error('회원 삭제 실패:', error);
    throw error;
  }
};

// 회원 역할 변경
export const updateMemberRole = async (memberId, role) => {
  try {
    const response = await api.patch(`/members/${memberId}/role`, { role });
    return response.data;
  } catch (error) {
    console.error('회원 역할 변경 실패:', error);
    throw error;
  }
};
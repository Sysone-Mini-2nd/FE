import api from './client';

export const getComments = async (issueId) => {
  try {
    const response = await api.get(`/issues/${issueId}/comments`);
    return response.data;
  } catch (error) {
    console.error('댓글 목록 조회 실패:', error);
    throw error;
  }
};

export const createComment = async (commentData) => {
  try {
    const { issueId, ...data } = commentData;
    const response = await api.post(`/issues/${issueId}/comments`, data); // data -> memberId, parentId(nullable), content
    return response.data;
  } catch (error) {
    console.error('댓글 생성 실패:', error);
    throw error;
  }
};

export const updateComment = async (commentData) => {
  try {
    const { commentId, ...data } = commentData;
    const response = await api.patch(`/comments/${commentId}`, data); // data -> content
    return response.data;
  } catch (error) {
    console.error('댓글 수정 실패:', error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error(`댓글 삭제 실패 (ID: ${commentId}):`, error);
    throw error;
  }
};
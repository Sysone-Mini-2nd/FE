import api from './axios';

// 회의록 생성
export const createMeeting = async (projectId, meetingData) => {
  try {
    // FormData 생성 - meetingData를 JSON 문자열로 전송
    const formData = new FormData();
    formData.append('meetingData', JSON.stringify({
      title: meetingData.title,
      content: meetingData.content,
      type: meetingData.type,
      progressDate: meetingData.progressDate,
      place: meetingData.place,
      participantIds: meetingData.participantIds
    }));

    const response = await api.post(`/meeting/${projectId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('회의록 생성 실패:', error);
    throw error;
  }
};

// 회의록 목록 조회 (페이지네이션 지원)
export const getMeetings = async (projectId, page = 1, size = 10) => {
  try {
    const response = await api.get(`/meeting/${projectId}`, {
      params: {
        page: page,
        size: size
      }
    });
    return response.data;
  } catch (error) {
    console.error('회의록 목록 조회 실패:', error);
    throw error;
  }
};

// 회의록 상세 조회
export const getMeetingDetail = async (projectId, meetingId) => {
  try {
    const response = await api.get(`/meeting/${projectId}/${meetingId}`);
    return response.data;
  } catch (error) {
    console.error('회의록 상세 조회 실패:', error);
    throw error;
  }
};

// 회의록 수정
export const updateMeeting = async (projectId, meetingId, meetingData) => {
  try {
    // FormData 생성 - meetingData를 JSON 문자열로 전송
    const formData = new FormData();
    formData.append('meetingData', JSON.stringify({
      title: meetingData.title,
      content: meetingData.content,
      type: meetingData.type,
      progressDate: meetingData.progressDate,
      place: meetingData.place,
      participantIds: meetingData.participantIds
    }));

    const response = await api.put(`/meeting/${projectId}/${meetingId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('회의록 수정 실패:', error);
    throw error;
  }
};

// 회의록 삭제
export const deleteMeeting = async (projectId, meetingId) => {
  try {
    const response = await api.delete(`/meeting/${projectId}/${meetingId}`);
    return response.data;
  } catch (error) {
    console.error('회의록 삭제 실패:', error);
    throw error;
  }
};

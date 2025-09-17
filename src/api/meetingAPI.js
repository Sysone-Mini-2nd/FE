import api from './client';
/** 작성자: 김대호, 배지원 */
// 회의록 생성
export const createMeeting = async (projectId, meetingData, audioFile = null) => {
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

    // 오디오 파일이 있으면 추가
    if (audioFile) {
      formData.append('audio', audioFile, 'recording.wav');
    }

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
export const updateMeeting = async (projectId, meetingId, meetingData, audioFile = null) => {
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

    // 오디오 파일이 있으면 추가
    if (audioFile) {
      formData.append('audio', audioFile, 'recording.wav');
    }

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

// 파일 다운로드 
export const downloadMeetingReport = async (projectId, meetingId) => {
  try {
    const response = await api.get(`/meeting/${projectId}/${meetingId}/report/download`, {
      responseType: 'blob',
    });
    
    // Content-Disposition 헤더에서 파일명 추출
    const contentDisposition = response.headers['content-disposition'];
    let fileName = 'meeting_report.docx'; // 기본 파일명
    
    if (contentDisposition) {
      console.log('Content-Disposition:', contentDisposition); // 디버깅용
      
      // 다양한 Content-Disposition 형식 지원
      let fileNameMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/);
      
      if (fileNameMatch && fileNameMatch[1]) {
        // RFC 5987 형식 (filename*=UTF-8''encoded-filename)
        try {
          fileName = decodeURIComponent(fileNameMatch[1]);
        } catch {
          // e 변수 제거
          console.warn('UTF-8 디코딩 실패, 원본 사용:', fileNameMatch[1]);
          fileName = fileNameMatch[1];
        }
      } else {
        // 일반 형식 (filename="filename")
        fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1];
        }
      }
    }
    
    console.log('추출된 파일명:', fileName); // 디버깅용
    
    // Blob 객체 생성
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    
    // 파일 다운로드 실행
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // 정리
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return { success: true, fileName };
  } catch (error) {
    console.error('회의록 다운로드 실패:', error);
    throw error;
  }
};


// 이메일 전송
export const sendMeetingEmail = async (projectId, meetingId, emailData, attachments = []) => {
  try {
    const formData = new FormData();
    
    // emailData를 JSON 문자열로 변환하여 추가
    formData.append('emailData', JSON.stringify({
      to: emailData.to,
      subject: emailData.subject,
      content: emailData.content
    }));
    
    // 첨부파일 추가 - index 매개변수 제거
    if (attachments && attachments.length > 0) {
      attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }
    
    const response = await api.post(`/meeting/${projectId}/${meetingId}/email`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('이메일 전송 실패:', error);
    throw error;
  }
};


// 회의록 작성 프로젝트 참여 인원 호출
export const getProjectParticipants = async (projectId) => {
  try {
    const response = await api.get(`/meeting/${projectId}/participant`);
    return response.data;
  } catch (error) {
    console.error('프로젝트 팀 인원 조회 실패:', error);
    throw error;
  }
};
import { create } from 'zustand'
import { getMeetings, deleteMeeting as deleteMeetingAPI, getMeetingDetail } from '../api/meetingAPI'

const useMeetingStore = create((set, get) => ({
  // 상태
  meetings: [],
  selectedMeeting: null,
  currentView: 'list', // 'list', 'detail', 'create', 'edit'
  loading: false,
  error: null,
  pagination: {
    page: 1,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false
  },

  // API에서 회의록 목록 조회
  fetchMeetings: async (projectId = 1, page = 1, size = 10) => {
    set({ loading: true, error: null });
    try {
      const response = await getMeetings(projectId, page, size);
      
      if (response.statusCode === 200) {
        const transformedMeetings = response.data.content.map((meeting) => ({
          id: meeting.id,
          title: meeting.title,
          organizer: meeting.writerName,
          type: meeting.type,
          scheduledDate: meeting.progressTime,
          location: meeting.place,
          participants: [], 
          participantCount: meeting.attendeeCount,
          description: meeting.content,
          createdAt: meeting.progressTime
        }));

        set({ 
          meetings: transformedMeetings,
          pagination: {
            page: response.data.page,
            size: response.data.size,
            totalElements: response.data.totalElements,
            totalPages: response.data.totalPages,
            hasNext: response.data.hasNext,
            hasPrevious: response.data.hasPrevious
          },
          loading: false 
        });
      }
    } catch (error) {
      console.error('회의록 목록 조회 실패:', error);
      set({ error: error.message, loading: false });
    }
  },

  // 회의록 상세 조회
  fetchMeetingDetail: async (meetingId, projectId = 1, listMeeting = null) => {
    set({ loading: true, error: null });
    try {
      const response = await getMeetingDetail(projectId, meetingId);
      
      if (response.statusCode === 200) {
        // 서버 응답을 프론트엔드 데이터 구조로 변환
        const meetingDetail = {
          id: meetingId,
          title: response.data.title,
          organizer: response.data.writerName,
          type: listMeeting?.type || 'MEETING', // 목록에서 가져온 타입 사용
          scheduledDate: response.data.progressDate,
          location: response.data.place,
          participants: response.data.participants, // [{ id, name }] 형태
          participantCount: response.data.participants?.length || 0,
          content: response.data.content, // 상세 내용
          description: response.data.content, // 호환성을 위해 동일하게 설정
          memo: response.data.content, // 호환성을 위해 동일하게 설정
          createdAt: response.data.progressDate, // 생성일이 없으므로 진행일로 대체
        };

        set({ 
          selectedMeeting: meetingDetail,
          currentView: 'detail',
          loading: false 
        });
      }
    } catch (error) {
      console.error('회의록 상세 조회 실패:', error);
      set({ error: error.message, loading: false });
    }
  },
  
  selectMeeting: async (meeting, projectId = 1) => {
    // 목록에서 선택할 때는 상세 정보를 가져와야 함
    // 목록 정보의 타입을 보존하기 위해 전달
    await get().fetchMeetingDetail(meeting.id, projectId, meeting);
  },
  
  showList: () => set({ 
    currentView: 'list', 
    selectedMeeting: null 
  }),
  
  showCreate: () => set({ 
    currentView: 'create' 
  }),
  
  showEdit: (meeting) => set({
    currentView: 'edit',
    selectedMeeting: meeting
  }),
  
  // 회의록 생성 후 목록 새로고침
  refreshAfterCreate: async (projectId = 1) => {
    const { fetchMeetings, pagination } = get();
    await fetchMeetings(projectId, pagination.page, pagination.size);
    set({ currentView: 'list' });
  },
  
  // 회의록 삭제
  deleteMeeting: async (meetingId, projectId = 1) => {
    try {
      await deleteMeetingAPI(projectId, meetingId);
      // 삭제 후 목록 새로고침
      const { fetchMeetings, pagination } = get();
      await fetchMeetings(projectId, pagination.page, pagination.size);
      set({ currentView: 'list', selectedMeeting: null });
    } catch (error) {
      console.error('회의록 삭제 실패:', error);
      set({ error: error.message });
    }
  },
  
  // 페이지 변경
  changePage: async (newPage, projectId = 1) => {
    const { pagination, fetchMeetings } = get();
    await fetchMeetings(projectId, newPage, pagination.size);
  }
}))

export default useMeetingStore

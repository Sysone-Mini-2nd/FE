import { create } from 'zustand'
import { getMeetings, deleteMeeting as deleteMeetingAPI, getMeetingDetail } from '../api/meetingAPI'
/** 작성자: 김대호, 배지원 */
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
  fetchMeetings: async (projectId , page = 1, size = 10) => {
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
          createdAt: meeting.progressTime,
          summary : meeting.aiSummary
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
  fetchMeetingDetail: async (meetingId, projectId, listMeeting = null) => {
  set({ loading: true, error: null });
  try {
    const response = await getMeetingDetail(projectId, meetingId);
    
    if (response.statusCode === 200) {
      const meetingDetail = {
        id: meetingId,
        projectId: projectId, // projectId 추가
        title: response.data.title,
        organizer: response.data.writerName,
        type: listMeeting?.type || 'MEETING', 
        scheduledDate: response.data.progressDate,
        location: response.data.place,
        participants: response.data.participants, 
        participantCount: response.data.participants?.length || 0,
        content: response.data.content,
        description: response.data.content, 
        memo: response.data.content, 
        createdAt: response.data.progressDate,
        summary : response.data.aiSummary
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
  
  selectMeeting: async (meeting, projectId  ) => {
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
  refreshAfterCreate: async (projectId) => {
    const { fetchMeetings, pagination } = get();
    await fetchMeetings(projectId, pagination.page, pagination.size);
    set({ currentView: 'list' });
  },
  
  // 회의록 삭제
  deleteMeeting: async (meetingId, projectId) => {
    try {
      await deleteMeetingAPI(projectId, meetingId);
      // 삭제 후 목록 새로고침
      const { fetchMeetings, pagination } = get();
      await fetchMeetings(projectId, pagination.page, pagination.size);
      set({ currentView: 'list', selectedMeeting: null });
    } catch (error) {
      console.error('회의록 삭제 실패:', error);
      set({ error: error.message });
      throw error; 
    }
  },
  
  // 페이지 변경
  changePage: async (newPage, projectId ) => {
    const { pagination, fetchMeetings } = get();
    await fetchMeetings(projectId, newPage, pagination.size);
  }
}))

export default useMeetingStore

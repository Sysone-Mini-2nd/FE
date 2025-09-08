import { create } from 'zustand'
import { meetingsData } from '../data/meetings'

const useMeetingStore = create((set) => ({
  // 상태
  meetings: meetingsData,
  selectedMeeting: null,
  currentView: 'list', // 'list', 'detail', 'create'
  
  // 액션들
  selectMeeting: (meeting) => set({ 
    selectedMeeting: meeting, 
    currentView: 'detail' 
  }),
  
  showList: () => set({ 
    currentView: 'list', 
    selectedMeeting: null 
  }),
  
  showCreate: () => set({ 
    currentView: 'create' 
  }),
  
  addMeeting: (newMeeting) => set((state) => ({
    meetings: [{ ...newMeeting, id: Date.now() }, ...state.meetings],
    currentView: 'list'
  })),
  
  deleteMeeting: (meetingId) => set((state) => ({
    meetings: state.meetings.filter(m => m.id !== meetingId),
    currentView: 'list',
    selectedMeeting: null
  })),
  
  updateMeeting: (updatedMeeting) => set((state) => ({
    meetings: state.meetings.map(m => 
      m.id === updatedMeeting.id ? updatedMeeting : m
    ),
    currentView: 'detail',
    selectedMeeting: updatedMeeting
  }))
}))

export default useMeetingStore

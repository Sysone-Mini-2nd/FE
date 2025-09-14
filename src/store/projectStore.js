import { create } from 'zustand';

// Zustand store로 프로젝트 선택 상태 관리
const useProjectStore = create((set) => ({
  selectedProjectId: null,
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
}));

export default useProjectStore;
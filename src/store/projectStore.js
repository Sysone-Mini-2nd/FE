import { create } from 'zustand';
/** 작성자: 김대호 */
// Zustand store로 프로젝트 선택 상태 관리
const useProjectStore = create((set) => ({
  selectedProjectId: null,
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
}));

export default useProjectStore;
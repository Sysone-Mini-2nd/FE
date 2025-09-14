import React, { useState, useEffect, useMemo } from "react";
import { Close } from "@mui/icons-material";
import Dropdown from "../common/Dropdown";
import SearchableDropdown from "../common/SearchableDropdown";
import MultiSelectDropdown from "../common/MultiSelectDropdown";
// 1. 상세 정보를 불러올 useProjectDetail 훅을 import 합니다.
import { useProjectDetail } from "../../hooks/useProjectQueries";

// (수정 모드) 백엔드 값을 프론트엔드 폼 값으로 변환하기 위한 역방향 매핑
const statusFromBE = { TODO: 'planning', IN_PROGRESS: 'progress', DONE: 'completed', PAUSED: 'paused' };
const priorityFromBE = { LOW: 'low', NORMAL: 'medium', HIGH: 'high' };

function ProjectModal({ isOpen, onClose, project, onSave, allMembers = [] }) {
  const [formData, setFormData] = useState({ name: "", desc: "", status: "planning", priority: "medium", startDate: "", endDate: "", pmId: null, memberIds: [] });

  // 2. project prop의 존재 여부로 "편집 모드"를 결정합니다.
  const isEditMode = !!project;
  const projectId = project?.id;

  // 3. "편집" 모드일 때만 useProjectDetail 훅을 호출하여 상세 정보를 가져옵니다.
  const { data: detailData, isLoading, isError } = useProjectDetail(projectId);

  const memberOptions = useMemo(() => allMembers.map(member => ({ value: member.id, label: member.name })), [allMembers]);
  const statusOptions = [ { value: "planning", label: "계획 중" }, { value: "progress", label: "진행 중" }, { value: "paused", label: "일시정지" }, { value: "completed", label: "완료" } ];
  const priorityOptions = [ { value: "high", label: "높음" }, { value: "medium", label: "보통" }, { value: "low", label: "낮음" } ];

  // 4. 모달이 열리거나, 상세 정보 로딩이 완료되면 폼 데이터를 채웁니다.
  useEffect(() => {
    if (isEditMode) {
      // "편집" 모드: 상세 정보(detailData)가 로딩되면 폼을 채웁니다.
      if (detailData) {
        setFormData({
          id: detailData.id, // 수정 시에는 id가 반드시 필요합니다.
          name: detailData.name || "",
          desc: detailData.desc || "",
          status: statusFromBE[detailData.status] || "planning",
          priority: priorityFromBE[detailData.priority] || "medium",
          startDate: detailData.startDate?.split('T')[0] || "",
          endDate: detailData.endDate?.split('T')[0] || "",
          pmId: detailData.pmId || null,
          memberIds: detailData.members?.map(m => m.id) || [],
        });
      }
    } else {
      // "생성" 모드: 폼을 깨끗하게 초기화합니다.
      setFormData({ name: "", desc: "", status: "planning", priority: "medium", startDate: "", endDate: "", pmId: null, memberIds: [] });
    }
  }, [isOpen, isEditMode, detailData]); // 모달이 열릴 때마다, 그리고 상세 데이터가 도착할 때마다 이 효과를 실행합니다.

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-45 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar">
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? "프로젝트 편집" : "새 프로젝트 생성"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Close className="w-6 h-6 text-gray-500" /></button>
        </div>

        {/* 5. "편집" 모드에서 로딩 중일 때 스피너를 보여줍니다. */}
        {isEditMode && isLoading ? (
          <div className="p-6 text-center">상세 정보를 불러오는 중...</div>
        ) : isEditMode && isError ? (
          <div className="p-6 text-center text-red-500">상세 정보를 불러오는 데 실패했습니다.</div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">프로젝트명 *</label><input type="text" required value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="프로젝트명을 입력하세요" /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">설명</label><textarea value={formData.desc} onChange={(e) => handleInputChange("desc", e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="프로젝트 설명을 입력하세요" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">상태</label><Dropdown options={statusOptions} value={formData.status} onChange={(value) => handleInputChange("status", value)} width="w-full" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">우선순위</label><Dropdown options={priorityOptions} value={formData.priority} onChange={(value) => handleInputChange("priority", value)} width="w-full" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">시작일 *</label><input type="date" required value={formData.startDate} onChange={(e) => handleInputChange("startDate", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">마감일 *</label><input type="date" required value={formData.endDate} onChange={(e) => handleInputChange("endDate", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">프로젝트 매니저 *</label><SearchableDropdown options={memberOptions} value={formData.pmId} onChange={(value) => handleInputChange("pmId", value)} placeholder="프로젝트 매니저를 선택하세요" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">팀원</label><MultiSelectDropdown options={memberOptions} values={formData.memberIds} onChange={(values) => handleInputChange("memberIds", values)} placeholder="팀원을 선택하세요" /></div>
            </div>
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">취소</button>
              <button type="submit" className="flex-1 px-4 py-2 bg-green-400 text-white rounded-lg hover:bg-green-500 transition-colors">{isEditMode ? "수정" : "생성"}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProjectModal;

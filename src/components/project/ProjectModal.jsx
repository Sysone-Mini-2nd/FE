import React, { useState, useEffect, useMemo } from "react";
import { Close, Add, Delete } from "@mui/icons-material";
import Dropdown from "../common/Dropdown";
import SearchableDropdown from "../common/SearchableDropdown";
import MultiSelectDropdown from "../common/MultiSelectDropdown";
import { useProjectDetail } from "../../hooks/useProjectQueries";
import { analyzeRequirements } from "../../api/projectAPI";

const statusFromBE = { TODO: 'planning', IN_PROGRESS: 'progress', DONE: 'completed', PAUSED: 'paused' };
const priorityFromBE = { LOW: 'low', NORMAL: 'medium', HIGH: 'high' };

function ProjectModal({ isOpen, onClose, project, onSave, allMembers = [] }) {
  const [formData, setFormData] = useState({ name: "", desc: "", status: "planning", priority: "medium", startDate: "", endDate: "", pmId: null, memberIds: [] });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [generatedIssues, setGeneratedIssues] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');

  const isEditMode = !!project;
  const projectId = project?.id;

  const { data: detailData, isLoading, isError } = useProjectDetail(projectId);

  const memberOptions = useMemo(() => allMembers.map(member => ({ value: member.id, label: member.name })), [allMembers]);
  const statusOptions = [ { value: "planning", label: "계획 중" }, { value: "progress", label: "진행 중" }, { value: "paused", label: "일시정지" }, { value: "completed", label: "완료" } ];
  const priorityOptions = [ { value: "high", label: "높음" }, { value: "medium", label: "보통" }, { value: "low", label: "낮음" } ];

  useEffect(() => {
    if (isOpen) {
        if (isEditMode) {
            if (detailData) {
                setFormData({
                    id: detailData.id,
                    name: detailData.name || "",
                    desc: detailData.desc || "",
                    status: statusFromBE[detailData.status] || "planning",
                    priority: priorityFromBE[detailData.priority] || "medium",
                    startDate: detailData.startDate?.split('T')[0] || "",
                    endDate: detailData.endDate?.split('T')[0] || "",
                    pmId: detailData.pmId || null,
                    memberIds: detailData.members?.map(m => m.id) || [],
                });
                setGeneratedIssues([]);
            }
        } else {
            setFormData({ name: "", desc: "", status: "planning", priority: "medium", startDate: "", endDate: "", pmId: null, memberIds: [] });
            setSelectedFile(null);
            setGeneratedIssues([]);
            setIsAnalyzing(false);
            setAnalysisError('');
        }
    }
  }, [isOpen, isEditMode, detailData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.xlsx')) {
      setSelectedFile(file);
      setAnalysisError('');
    } else {
      setSelectedFile(null);
      setAnalysisError('올바른 .xlsx 파일을 선택해주세요.');
    }
  };

  const handleAnalyzeFile = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    setAnalysisError('');
    setGeneratedIssues([]);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const response = await analyzeRequirements(formData);
      setGeneratedIssues(response.data || []);
    } catch (error) {
      setAnalysisError('이슈 추출에 실패했습니다. 파일을 다시 확인해주세요.');
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleIssueChange = (index, field, value) => {
    const newIssues = [...generatedIssues];
    newIssues[index][field] = value;
    setGeneratedIssues(newIssues);
  };

  const handleAddIssue = () => {
    setGeneratedIssues([...generatedIssues, { title: '', desc: '' }]);
  };

  const handleDeleteIssue = (index) => {
    const newIssues = generatedIssues.filter((_, i) => i !== index);
    setGeneratedIssues(newIssues);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, issues: generatedIssues });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-45 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar">
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{isEditMode ? "프로젝트 편집" : "새 프로젝트 생성"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Close className="w-6 h-6 text-gray-500" /></button>
        </div>

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

            {!isEditMode && (
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-800">요구사항 기반 이슈 추출</h3>
                <div className="flex items-center gap-4">
                  <input type="file" accept=".xlsx" onChange={handleFileChange} className="flex-1 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                  <button type="button" onClick={handleAnalyzeFile} disabled={!selectedFile || isAnalyzing} className="px-4 py-2 bg-gray-600 text-white rounded-lg disabled:bg-gray-300">
                    {isAnalyzing ? "분석 중..." : "파일 분석"}
                  </button>
                </div>
                {analysisError && <p className="text-sm text-red-500">{analysisError}</p>}

                {/* --- 이슈 목록 표시 영역 --- */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2"> {/* 스크롤 UI 개선을 위해 pr-2 추가 */}
                  {isAnalyzing ? (
                    <div className="p-4 text-center text-gray-500">요구사항을 분석하여 이슈를 생성하고 있습니다...</div>
                  ) : (
                    generatedIssues.map((issue, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg flex items-start gap-3">
                        <div className="flex-1 space-y-2">
                          <input type="text" placeholder="이슈 제목" value={issue.title} onChange={(e) => handleIssueChange(index, 'title', e.target.value)} className="w-full px-2 py-1 border border-gray-200 rounded-md" />
                          <textarea placeholder="이슈 설명" value={issue.desc} onChange={(e) => handleIssueChange(index, 'desc', e.target.value)} rows={2} className="w-full px-2 py-1 border border-gray-200 rounded-md"></textarea>
                        </div>
                        <button type="button" onClick={() => handleDeleteIssue(index)} className="p-2 text-gray-400 hover:text-red-500"><Delete /></button>
                      </div>
                    ))
                  )}
                </div>

                {generatedIssues.length > 0 && !isAnalyzing && (
                    <button type="button" onClick={handleAddIssue} className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:bg-gray-100 hover:border-gray-400">
                        <Add /> 이슈 추가
                    </button>
                )}
              </div>
            )}

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

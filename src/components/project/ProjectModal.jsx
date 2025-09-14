import React, { useState, useEffect } from "react";
import { Close } from "@mui/icons-material";
import Dropdown from "../common/Dropdown";
import SearchableDropdown from "../common/SearchableDropdown";
import MultiSelectDropdown from "../common/MultiSelectDropdown";
import { employeesData } from "../../data/employees";

function ProjectModal({ isOpen, onClose, project, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "planning",
    priority: "medium",
    startDate: "",
    endDate: "",
    manager: "",
    team: [],
    progress: 0,
    completedTasks: 0,
    totalTasks: 1,
  });

  // 드롭다운 옵션들
  const statusOptions = [
    { value: "planning", label: "계획 중" },
    { value: "progress", label: "진행 중" },
    { value: "paused", label: "일시정지" },
    { value: "completed", label: "완료" }
  ];

  const priorityOptions = [
    { value: "high", label: "높음" },
    { value: "medium", label: "보통" },
    { value: "low", label: "낮음" }
  ];

  // 직원 데이터를 드롭다운 옵션으로 변환
  const employeeOptions = employeesData.map(emp => ({
    value: emp.name,
    label: `${emp.name} (${emp.department} ${emp.position})`
  }));

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({
        name: "",
        description: "",
        status: "planning",
        priority: "medium",
        startDate: "",
        endDate: "",
        manager: "",
        team: [],
        progress: 0,
        completedTasks: 0,
        totalTasks: 1,
      });
    }
  }, [project]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-45 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar">
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {project ? "프로젝트 편집" : "새 프로젝트 생성"}
          </h2>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Close className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                프로젝트명 *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="프로젝트명을 입력하세요"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설명
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="프로젝트 설명을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상태
              </label>
              <Dropdown
                options={statusOptions}
                value={formData.status}
                onChange={(value) => handleInputChange("status", value)}
                placeholder="상태를 선택하세요"
                width="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                우선순위
              </label>
              <Dropdown
                options={priorityOptions}
                value={formData.priority}
                onChange={(value) => handleInputChange("priority", value)}
                placeholder="우선순위를 선택하세요"
                width="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시작일 *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                마감일 *
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                프로젝트 매니저 *
              </label>
              <SearchableDropdown
                options={employeeOptions}
                value={formData.manager}
                onChange={(value) => handleInputChange("manager", value)}
                placeholder="프로젝트 매니저를 선택하세요"
                searchPlaceholder="직원 이름 검색..."
                clearable={true}
              />
            </div>

          {/* 팀원 관리 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              팀원
            </label>
            <MultiSelectDropdown
              options={employeeOptions}
              values={formData.team}
              onChange={(values) => handleInputChange("team", values)}
              placeholder="팀원을 선택하세요"
              searchPlaceholder="직원 이름 검색..."
              maxDisplay={3}
            />
          </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-400 text-white rounded-lg hover:bg-green-500 transition-colors"
            >
              {project ? "수정" : "생성"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectModal;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVert } from "@mui/icons-material";

function ProjectCard({ project, onAction }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // API 응답(대문자 ENUM)에 맞춰 상태 정보 반환
  const getStatusInfo = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return { label: "진행중", color: "bg-green-500/20 text-green-700 border-green-200/50" };
      case "DONE":
        return { label: "완료", color: "bg-blue-500/20 text-blue-700 border-blue-200/50" };
      case "PAUSED":
        return { label: "일시정지", color: "bg-yellow-500/20 text-yellow-700 border-yellow-200/50" };
      case "TODO":
        return { label: "계획중", color: "bg-gray-500/20 text-gray-700 border-gray-200/50" };
      default:
        return { label: status, color: "bg-gray-500/20 text-gray-700 border-gray-200/50" };
    }
  };

  // API 응답(대문자 ENUM)에 맞춰 우선순위 색상 반환
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH": return "bg-red-500/10 border-red-200/30";
      case "NORMAL": return "bg-yellow-500/10 border-yellow-200/30";
      case "LOW": return "bg-green-500/10 border-green-200/30";
      default: return "bg-gray-500/10 border-gray-200/30";
    }
  };

  const statusInfo = getStatusInfo(project.status);
  
  // API에 progress가 없으므로 status 기반으로 계산
  // const progress = project.status === 'DONE' ? 100 : project.status === 'TODO' ? 0 : (project.progress || 50); // 기본값 50
  const progress = Math.round(project.progressRate);

  const progressColor = progress >= 80 ? "bg-green-600" : progress >= 50 ? "bg-blue-600" : "bg-gray-400";

  const isOverdue = new Date(project.endDate) < new Date() && project.status === "IN_PROGRESS";

  return (
    <div
      className="bg-white/80 backdrop-blur-md border border-white/20 p-4 hover:bg-white/90 hover:border-white/30 transition-all duration-300 cursor-pointer shadow-lg shadow-black/5 relative overflow-hidden"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <div className={`absolute inset-0 ${getPriorityColor(project.priority)} backdrop-blur-sm`}></div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-grow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-1">
                {project.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                {project.desc} 
              </p>
            </div>

            <div className="relative" ref={menuRef}>
              <button
                className="p-1 hover:bg-white/50 backdrop-blur-sm rounded-full transition-all"
                onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
              >
                <MoreVert className="w-4 h-4 text-gray-500" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-white/90 backdrop-blur-md border border-white/20 shadow-lg py-1 z-20 rounded-md">
                  <button onClick={(e) => { e.stopPropagation(); onAction("edit", project); setIsMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100/50">편집</button>
                  <div className="border-t border-gray-200/50 my-1"></div>
                  <button onClick={(e) => { e.stopPropagation(); onAction("delete", project); setIsMenuOpen(false);}} className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50/50">삭제</button>
                </div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className={`px-2 py-1 text-xs font-medium border ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
              <span className="text-sm text-gray-700">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200/50 backdrop-blur-sm h-1.5">
              <div className={`h-1.5 transition-all duration-300 ${progressColor}`} style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200/60 pt-3 text-xs text-gray-600">
            <div className="flex items-center justify-between">
                <span>PM: <span className="font-semibold text-gray-800">{project.pmName}</span></span>
                <span>팀원: <span className="font-semibold text-gray-800">{project.totalMemberCount}명</span></span>
            </div>
            <div className="flex items-center justify-between mt-2">
                <span>마감일: <span className="font-semibold text-gray-800">{new Date(project.endDate).toLocaleDateString()}</span></span>
                {isOverdue && <span className="text-red-600 font-bold">지연</span>}
            </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;

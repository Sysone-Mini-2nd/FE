import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVert, PersonOutline, GroupOutlined } from "@mui/icons-material";

const statusStyleMap = {
  IN_PROGRESS: "progress",
  DONE: "completed",
  PAUSED: "paused",
  TODO: "planning",
};

const getProjectStatusStyles = (status) => {
  switch (status) {
    case "progress":
      return "bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300";
    case "completed":
      return "bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-300";
    case "paused":
      return "bg-yellow-50 border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300";
    case "planning":
      return "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300";
    default:
      return "bg-white border-gray-200 hover:bg-gray-50";
  }
};

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

  const getStatusInfo = (status) => {
    switch (status) {
      case "IN_PROGRESS": return { label: "진행중", color: "text-blue-700" };
      case "DONE": return { label: "완료", color: "text-green-700" };
      case "PAUSED": return { label: "일시정지", color: "text-yellow-700" };
      case "TODO": return { label: "계획중", color: "text-gray-700" };
      default: return { label: status, color: "text-gray-700" };
    }
  };

  const statusInfo = getStatusInfo(project.status);
  // 1. project.progress -> project.progressRate 로 수정합니다.
  const progressValue = project.progressRate || 0;
  const progressColor = progressValue >= 80 ? "bg-green-500" : progressValue >= 50 ? "bg-blue-500" : "bg-gray-400";
  const isOverdue = new Date(project.endDate) < new Date() && project.status === "IN_PROGRESS";

  return (
    <div
      className={`border p-4 transition-all duration-300 cursor-pointer shadow-sm rounded-lg ${getProjectStatusStyles(statusStyleMap[project.status])}`}
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-1">
              {project.name}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2 mt-1">
              {project.desc}
            </p>
          </div>
          <div className="relative" ref={menuRef}>
            <button
              className="p-1 hover:bg-gray-200/50 rounded transition-all"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              <MoreVert className="w-5 h-5 text-gray-500" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 shadow-lg rounded-md py-1 z-20">
                <button
                  onClick={(e) => { e.stopPropagation(); onAction("edit", project); setIsMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                >
                  편집
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={(e) => { e.stopPropagation(); onAction("delete", project); setIsMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between mb-2 text-xs">
            <span className={`font-semibold ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
            <span className="font-medium text-gray-600">{progressValue}%</span>
          </div>
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-1.5 transition-all duration-300 ${progressColor}`}
              style={{ width: `${progressValue}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200/50">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <PersonOutline sx={{ fontSize: 14 }} />
              {project.pmName || '-'}
            </span>
            <span className="flex items-center gap-1">
              <GroupOutlined sx={{ fontSize: 14 }} />
              {project.totalMemberCount || 0}명
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>{new Date(project.endDate).toLocaleDateString()}</span>
            {isOverdue && <span className="text-red-500 font-semibold">지연</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;

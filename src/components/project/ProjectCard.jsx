import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MoreVert,
  Group,
  Schedule,
  PlayArrow,
  CheckCircle,
  Pause,
  HourglassEmpty,
} from "@mui/icons-material";

function ProjectCard({ project, onAction }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // 외부 클릭 시 메뉴 닫기
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
      case "progress":
        return {
          label: "진행중",
          color:
            "bg-green-500/20 text-green-700 border-green-200/50 backdrop-blur-sm",
        };
      case "completed":
        return {
          label: "완료",
          color:
            "bg-blue-500/20 text-blue-700 border-blue-200/50 backdrop-blur-sm",
        };
      case "paused":
        return {
          label: "일시정지",
          color:
            "bg-yellow-500/20 text-yellow-700 border-yellow-200/50 backdrop-blur-sm",
        };
      case "planning":
        return {
          label: "계획중",
          color:
            "bg-gray-500/20 text-gray-700 border-gray-200/50 backdrop-blur-sm",
        };
      default:
        return {
          label: status,
          color:
            "bg-gray-500/20 text-gray-700 border-gray-200/50 backdrop-blur-sm",
        };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 border-red-200/30";
      case "medium":
        return "bg-yellow-500/10 border-yellow-200/30";
      case "low":
        return "bg-green-500/10 border-green-200/30";
      default:
        return "bg-gray-500/10 border-gray-200/30";
    }
  };

  const statusInfo = getStatusInfo(project.status);
  const progressColor =
    project.progress >= 80
      ? "bg-green-600"
      : project.progress >= 50
      ? "bg-blue-600"
      : "bg-gray-400";

  const isOverdue =
    new Date(project.endDate) < new Date() && project.status === "progress";
  // const daysRemaining = Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24))

  return (
    <div
      className="bg-white/80 backdrop-blur-md border border-white/20 p-4 hover:bg-white/90 hover:border-white/30 transition-all duration-300 cursor-pointer shadow-lg shadow-black/5 relative overflow-hidden"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      {/* 우선순위 배경 */}
      <div
        className={`absolute inset-0 ${getPriorityColor(
          project.priority
        )} backdrop-blur-sm`}
      ></div>

      {/* 컨텐츠 */}
      <div className="relative z-10">
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-1">
                {project.name}
              </h3>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {project.description}
            </p>
          </div>

          {/* 액션 메뉴 */}
          <div className="relative" ref={menuRef}>
            <button
              className="p-1 hover:bg-white/50 backdrop-blur-sm rounded transition-all"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              <MoreVert className="w-4 h-4 text-gray-500" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-white/90 backdrop-blur-md border border-white/20 shadow-lg py-1 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction("edit", project);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-white/50"
                >
                  편집
                </button>
                <div className="border-t border-white/20 my-1"></div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction("delete", project);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50/50"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 상태 및 진행률 */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span
              className={`px-2 py-1 text-xs font-medium border backdrop-blur-sm ${statusInfo.color}`}
            >
              {statusInfo.label}
            </span>
            <span className="text-sm text-gray-700">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200/50 backdrop-blur-sm h-1.5 rounded-full">
            <div
              className={`h-1.5 transition-all duration-300 rounded-full ${progressColor}`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>
            {project.completedTasks}/{project.totalTasks} 작업
          </span>
          <span>{project.team.length}명</span>
          <span>{new Date(project.endDate).toLocaleDateString()}</span>
          {isOverdue && <span className="text-red-600 font-medium">지연</span>}
        </div>

        {/* 담당자 */}
        <div className="mt-3 pt-3 text-xs flex justify-between ">
          <span className="selected-none text-gray-500">PM: {project.manager}</span>
          <span >
            {Array.isArray(project.team)
              ? project.team.length > 3
                ? project.team.slice(0, 3).join(", ") + "..."
                : project.team.join(", ")
              : project.team}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;

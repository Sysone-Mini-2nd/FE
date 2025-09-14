import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowBack,
  Assignment,
  Timeline,
  PeopleAlt,
  MeetingRoom,
} from "@mui/icons-material";
import Kanban from "../components/kanban/Kanban";
import GanttChart from "../components/ganttchart/GanttChart";
import Meeting from "../components/meeting/Meeting";
import TeamManagement from "../components/teammanage/TeamManagement";
import { useProjectDetail } from "../hooks/useProjectQueries";

const getStatusColor = (status) => {
  switch (status) {
    case 'TODO': return 'bg-gray-100 text-gray-800';
    case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
    case 'DONE': return 'bg-green-100 text-green-800';
    case 'PAUSED': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'TODO': return '계획중';
    case 'IN_PROGRESS': return '진행중';
    case 'DONE': return '완료';
    case 'PAUSED': return '정지';
    default: return '알 수 없음';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'HIGH': return 'text-red-600';
    case 'NORMAL': return 'text-yellow-600';
    case 'LOW': return 'text-green-600';
    default: return 'text-gray-600';
  }
};

const getPriorityText = (priority) => {
    switch (priority) {
      case 'HIGH': return '높음';
      case 'NORMAL': return '보통';
      case 'LOW': return '낮음';
      default: return '알 수 없음';
    }
  };

function ProjectDetail() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("kanban");

  const { data: project, isLoading, isError } = useProjectDetail(projectId);

  const tabs = [
    { id: "kanban", label: "칸반 보드", icon: Assignment },
    { id: "timeline", label: "간트차트", icon: Timeline },
    { id: "meeting", label: "회의록", icon: MeetingRoom },
    { id: "team", label: "팀 관리", icon: PeopleAlt },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "kanban":
        // Kanban 컴포넌트에 members 데이터를 props로 전달합니다.
        return <Kanban projectId={projectId} members={project.members} />;
      case "timeline":
        return <GanttChart projectId={projectId} />;
      case "meeting":
        return <Meeting projectId={projectId} />;
      case "team":
        return <TeamManagement members={project.members} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div>프로젝트 정보를 불러오는 중...</div>;
  }

  if (isError || !project) {
    return <div>프로젝트 정보를 불러오는 중 에러가 발생했거나, 프로젝트가 존재하지 않습니다.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/projects")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowBack className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                <span className={`px-2 py-1 text-xs font-medium rounded-md ${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
                <span className={`text-sm font-medium ${getPriorityColor(project.priority)}`}>
                  {getPriorityText(project.priority)}
                </span>
              </div>
              <p className="text-gray-600 mt-1">{project.desc}</p>
            </div>
          </div>
        </div>
        <div className="ml-16 mt-4 flex gap-6 text-sm text-gray-600">
          <div>매니저: <span className="font-medium">{project.pmName}</span></div>
          <div>시작일: <span className="font-medium">{project.startDate.substring(0, 10)}</span></div>
          <div>완료 예정일: <span className="font-medium">{project.endDate.substring(0, 10)}</span></div>
          <div>팀원: <span className="font-medium">{project.totalMemberCount}명</span></div>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 transition-all ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto pt-4">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default ProjectDetail;

import { useState } from "react";
import {
  ArrowBack,
  CalendarToday,
  Person,
  Flag,
  Assignment,
  Delete,
  Schedule,
  Edit,
  Save,
  Cancel,
} from "@mui/icons-material";
import BadgeComponent from "./BadgeComponent";
import Dropdown from "./Dropdown";
import { membersData } from "../../data/employees";

function TaskDetail({ task, onBack, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    ...task,
    memberId:
      task?.memberId || task?.memberName
        ? membersData.find((m) => m.name === task.memberName)?.id
        : null,
  });

  // 편집 핸들러
  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      ...task,
      memberId:
        task?.memberId || task?.memberName
          ? membersData.find((m) => m.name === task.memberName)?.id
          : null,
    });
  };

  const handleDelete = () => {
    if (window.confirm("이 작업을 삭제하시겠습니까?")) {
      if (onDelete) {
        onDelete(task.id);
      }
    }
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(task.id, editData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      ...task,
      memberId:
        task?.memberId || task?.memberName
          ? membersData.find((m) => m.name === task.memberName)?.id
          : null,
    });
    setIsEditing(false);
  };

  // 드롭다운 옵션 데이터
  const statusOptions = [
    { value: "TODO", label: "할 일" },
    { value: "PROGRESS", label: "진행 중" },
    { value: "DONE", label: "완료" },
  ];

  const priorityOptions = [
    { value: "HIGH", label: "높음" },
    { value: "MEDIUM", label: "보통" },
    { value: "LOW", label: "낮음" },
  ];

  const memberOptions = membersData.map((member) => ({
    value: member.id,
    label: member.name,
  }));
  if (!task) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">작업 정보를 찾을 수 없습니다.</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  // 우선순위 표시
  const getPriorityInfo = (priority) => {
    switch (priority?.toUpperCase()) {
      case "HIGH":
        return { label: "높음", color: "text-red-600 bg-red-50" };
      case "MEDIUM":
        return { label: "보통", color: "text-yellow-600 bg-yellow-50" };
      case "LOW":
        return { label: "낮음", color: "text-green-600 bg-green-50" };
      default:
        return { label: priority, color: "text-gray-600 bg-gray-50" };
    }
  };

  // 상태 표시
  const getStatusInfo = (status) => {
    switch (status?.toUpperCase()) {
      case "TODO":
        return { label: "할 일", color: "text-gray-600 bg-gray-100" };
      case "PROGRESS":
        return { label: "진행 중", color: "text-blue-600 bg-blue-100" };
      case "DONE":
        return { label: "완료", color: "text-green-600 bg-green-100" };
      default:
        return { label: status, color: "text-gray-600 bg-gray-100" };
    }
  };

  const priorityInfo = getPriorityInfo(task.priority);
  const statusInfo = getStatusInfo(task.status);

  // 메타데이터 구성
  const metadataItems = [
    { label: "작업 ID", value: `${task.id}` },
    { label: "프로젝트 ID", value: `${task.projectId}` },
    {
      label: "생성일",
      value: task.createdAt
        ? new Date(task.createdAt).toLocaleDateString("ko-KR")
        : "-",
    },
    {
      label: "수정일",
      value: task.updatedAt
        ? new Date(task.updatedAt).toLocaleDateString("ko-KR")
        : "-",
    },
  ];

  return (
    <div className="min-h-full">
      <div className="mx-auto">
        {/* 헤더 */}
        <div className="pb-4 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors mt-1"
              >
                <ArrowBack className="w-7 h-7 text-gray-600" />
              </button>
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.title || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, title: e.target.value })
                    }
                    className="text-2xl font-semibold text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="작업 제목을 입력하세요"
                  />
                ) : (
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {task.title}
                  </h1>
                )}
                <div className="flex items-center gap-4 mt-3">
                  {/* 상태 */}
                  <div className="flex items-center gap-2">
                    <Assignment className="w-5 h-5 text-gray-500" />
                    {isEditing ? (
                      <Dropdown
                        options={statusOptions}
                        value={editData.status}
                        onChange={(value) =>
                          setEditData({ ...editData, status: value })
                        }
                        width="w-32"
                        className="text-sm"
                      />
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                    )}
                  </div>

                  {/* 우선순위 */}
                  <div className="flex items-center gap-2">
                    <Flag className="w-5 h-5 text-gray-500" />
                    {isEditing ? (
                      <Dropdown
                        options={priorityOptions}
                        value={editData.priority}
                        onChange={(value) =>
                          setEditData({ ...editData, priority: value })
                        }
                        width="w-32"
                        className="text-sm"
                      />
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${priorityInfo.color}`}
                      >
                        {priorityInfo.label}
                      </span>
                    )}
                  </div>

                  {/* 담당자 */}
                  <div className="flex items-center gap-2">
                    <Person className="w-5 h-5 text-gray-500" />
                    {isEditing ? (
                      <Dropdown
                        options={memberOptions}
                        value={editData.memberId}
                        onChange={(value) => {
                          const selectedMember = membersData.find(
                            (m) => m.id === value
                          );
                          setEditData({
                            ...editData,
                            memberId: value,
                            memberName: selectedMember?.name || "",
                          });
                        }}
                        width="w-36"
                        className="text-sm"
                        placeholder="담당자 선택"
                      />
                    ) : (
                      <span className="text-sm text-gray-700">
                        {task.memberName || "담당자 미지정"}
                      </span>
                    )}
                  </div>

                  {/* 마감일 */}
                  <div className="flex items-center gap-2">
                    <Schedule className="w-5 h-5 text-gray-500" />
                    {isEditing ? (
                      <input
                        type="date"
                        value={
                          editData.endDate
                            ? new Date(editData.endDate)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          setEditData({ ...editData, endDate: e.target.value })
                        }
                        className="text-sm text-gray-700 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      task.endDate && (
                        <span className="text-sm text-gray-700">
                          {formatDate(task.endDate)}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* 태그 */}
                {task.tags && task.tags.length > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-sm text-gray-500">태그:</span>
                    <div className="flex flex-wrap gap-2">
                      {task.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                        >
                          {typeof tag === "object" ? tag.name : tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 편집 버튼 영역 */}
            <div className="flex items-center gap-2 ml-4">
              {isEditing ? (
                <>
                  <button 
                    onClick={handleSave} 
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    저장
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <Cancel className="w-4 h-4" />
                    취소
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleEdit} 
                    className="editBtn"
                  >
                    <Edit />
                    편집
                  </button>
                  <button 
                    onClick={handleDelete} 
                    className="deleteBtn"
                  >
                    <Delete/>
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-3">
            {/* 작업 설명 */}
            <div className="rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-3">작업 설명</h2>
              <div className="rounded-lg p-4 border border-gray-200 bg-gray-50">
                {isEditing ? (
                  <textarea
                    value={editData.desc || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, desc: e.target.value })
                    }
                    className="w-full whitespace-pre-wrap leading-relaxed text-gray-700 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={6}
                    placeholder="작업 설명을 입력하세요"
                  />
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
                    {task.desc || "작업 설명이 작성되지 않았습니다."}
                  </p>
                )}
              </div>
            </div>

            {/* 메타 정보 */}
            <div className="rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-3">작업 정보</h2>
              <div className="grid grid-cols-4 gap-4">
                {metadataItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between p-3 bg-gray-100"
                  >
                    <span className="text-gray-600 font-medium">
                      {item.label}
                    </span>
                    <span className={`text-gray-900 ${item.className || ""}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 일정 정보 */}
            <div className="rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-3">일정</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* 시작일 */}
                  <div>
                    <span className="text-gray-600 font-medium block mb-1">
                      시작일
                    </span>
                    {isEditing ? (
                      <input
                        type="date"
                        value={
                          editData.startDate
                            ? new Date(editData.startDate)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            startDate: e.target.value,
                          })
                        }
                        className="text-gray-900 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="text-gray-900">
                        {task.startDate ? formatDate(task.startDate) : "-"}
                      </span>
                    )}
                  </div>

                  {/* 마감일 */}
                  <div>
                    <span className="text-gray-600 font-medium block mb-1">
                      마감일
                    </span>
                    {isEditing ? (
                      <input
                        type="date"
                        value={
                          editData.endDate
                            ? new Date(editData.endDate)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          setEditData({ ...editData, endDate: e.target.value })
                        }
                        className="text-gray-900 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="text-gray-900">
                        {task.endDate ? formatDate(task.endDate) : "-"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 우측 영역 - 댓글 공간 (추후 구현) */}
          <div className="col-span-2">
            <div className=" p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">댓글</h3>
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">댓글 여기 넣을거임</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;

import { ArrowBack, Person, Flag, Assignment, Schedule } from "@mui/icons-material";
import Dropdown from "../Dropdown";
import { membersData } from "../../../data/employees";
/** 작성자: 김대호 */
function TaskHeader({
  task,
  isEditing,
  editData,
  setEditData,
  onBack,
  children,
  members
}) {
  // 드롭다운 옵션 데이터
  const statusOptions = [
    { value: "TODO", label: "할 일" },
    { value: "IN_PROGRESS", label: "진행 중" },
    { value: "DONE", label: "완료" },
  ];

  const priorityOptions = [
    { value: "WARNING", label: "긴급"},
    { value: "HIGH", label: "높음" },
    { value: "NORMAL", label: "보통" },
    { value: "LOW", label: "낮음" },
  ];

  const memberOptions = members.map((member) => ({
    value: member.id,
    label: member.name,
  }));

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
      case "WARNING":
        return { label: "긴급", color: "text-orange-600 bg-orange-50" };
      case "HIGH":
        return { label: "높음", color: "text-red-600 bg-red-50" };
      case "NORMAL":
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
      case "IN_PROGRESS":
        return { label: "진행 중", color: "text-blue-600 bg-blue-100" };
      case "DONE":
        return { label: "완료", color: "text-green-600 bg-green-100" };
      default:
        return { label: status, color: "text-gray-600 bg-gray-100" };
    }
  };

  const priorityInfo = getPriorityInfo(task.priority);
  const statusInfo = getStatusInfo(task.status);

  return (
    <div className="pb-4 mt-1 border-b border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors mt-1"
          >
            <ArrowBack className="text-gray-600" />
          </button>
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editData.title || ""}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                className="text-2xl font-semibold focus:outline-none hover:border-gray-400 text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-2 w-full"
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
                <Assignment className="text-gray-500" />
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
                <Person className="text-gray-500" />
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
                <Schedule className="text-gray-500" />
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
                    className="text-sm text-gray-700 border border-gray-300 rounded px-2 py-2 focus:outline-none"
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
          </div>
        </div>

        {/* 편집*/}
        <div className="flex items-center gap-3 mt-1 ml-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default TaskHeader;
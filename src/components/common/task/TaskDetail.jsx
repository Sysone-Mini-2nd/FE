import { useState } from "react";
import TaskHeader from "./TaskHeader";
import TaskActions from "./TaskActions";
import TaskDescription from "./TaskDescription";
import TaskMetadata from "./TaskMetadata";
import TaskSchedule from "./TaskSchedule";
import TaskComments from "./TaskComments";
import { membersData } from "../../../data/employees";

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

  return (
    <div className="min-h-full">
      <div className="mx-auto">
        {/* 헤더 */}
        <TaskHeader
          task={task}
          isEditing={isEditing}
          editData={editData}
          setEditData={setEditData}
          onBack={onBack}
        >
          <TaskActions
            isEditing={isEditing}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </TaskHeader>

        {/* 메인 컨텐츠 */}
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-3">
            {/* 작업 설명 */}
            <TaskDescription
              task={task}
              isEditing={isEditing}
              editData={editData}
              setEditData={setEditData}
            />

            {/* 메타 정보*/}
            <TaskMetadata task={task} />

            {/* 일정*/}
            <TaskSchedule
              task={task}
              isEditing={isEditing}
              editData={editData}
              setEditData={setEditData}
            />
          </div>

          {/* 댓글 */}
          <TaskComments />
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;

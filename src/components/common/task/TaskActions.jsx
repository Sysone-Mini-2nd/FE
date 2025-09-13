import { Delete, Edit } from "@mui/icons-material";

function TaskActions({ 
  isEditing, 
  onEdit, 
  onDelete, 
  onSave, 
  onCancel 
}) {
  return (
    <>
      {isEditing ? (
        <>
          <button onClick={onCancel} className="cancelBtn">
            취소
          </button>
          <button onClick={onSave} className="createBtn">
            저장
          </button>
        </>
      ) : (
        <div className="flex items-center gap-3">
          <button onClick={onEdit} className="editBtn">
            <Edit />
            편집
          </button>
          <button onClick={onDelete} className="deleteBtn">
            <Delete />
            삭제
          </button>
        </div>
      )}
    </>
  );
}

export default TaskActions;
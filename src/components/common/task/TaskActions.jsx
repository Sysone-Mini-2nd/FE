import { Delete, Edit } from "@mui/icons-material";
/** 작성자: 김대호 */
function TaskActions({
                       isEditing,
                       onEdit,
                       onDelete,
                       onSave,
                       onCancel,
                       isLoading = false // 로딩 상태 추가
                     }) {
  return (
    <>
      {isEditing ? (
        <>
          <button
            onClick={onCancel}
            className="cancelBtn"
            disabled={isLoading}
          >
            취소
          </button>
          <button
            onClick={onSave}
            className="createBtn"
            disabled={isLoading}
          >
            {isLoading ? '저장 중...' : '저장'}
          </button>
        </>
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={onEdit}
            className="editBtn"
            disabled={isLoading}
          >
            <Edit />
            편집
          </button>
          <button
            onClick={onDelete}
            className="deleteBtn"
            disabled={isLoading}
          >
            <Delete />
            {isLoading ? '삭제 중...' : '삭제'}
          </button>
        </div>
      )}
    </>
  );
}

export default TaskActions;
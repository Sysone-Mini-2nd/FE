/** 작성자: 김대호 */
function TaskDescription({
  task, 
  isEditing, 
  editData, 
  setEditData 
}) {
  return (
    <div className="rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-3">작업 설명</h2>
      <div className="rounded-lg border p-3 border-gray-200 bg-white select-none">
        {isEditing ? (
          <textarea
            value={editData.desc || ""}
            onChange={(e) =>
              setEditData({ ...editData, desc: e.target.value })
            }
            className="w-full whitespace-pre-wrap leading-relaxed text-gray-700 rounded-lg focus:outline-none resize-none"
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
  );
}

export default TaskDescription;
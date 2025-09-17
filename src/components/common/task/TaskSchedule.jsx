/** 작성자: 김대호 */
function TaskSchedule({
  task, 
  isEditing, 
  editData, 
  setEditData 
}) {
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

  return (
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
  );
}

export default TaskSchedule;
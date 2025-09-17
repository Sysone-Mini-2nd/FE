/** 작성자: 김대호 */
function TaskMetadata({ task }) {
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
  );
}

export default TaskMetadata;
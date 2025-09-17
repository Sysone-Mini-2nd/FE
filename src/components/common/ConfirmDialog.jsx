/** 작성자: 김대호 */
const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
  type = "warning",
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* 다이얼로그 */}
      <div className="modal select-none">
        <div className="bg-white rounded-lg p-6 min-w-80 max-w-md shadow-xl">
          {/* 헤더 */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>

          {/* 메시지 */}
          <div className="mb-6">
            <p className="text-gray-700 whitespace-pre-line">{message}</p>
          </div>

          {/* 버튼들 */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded text-white transition-colors ${
                type === "danger" 
                  ? "bg-red-300 hover:bg-red-600" 
                  : "bg-blue-300 hover:bg-blue-600"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;
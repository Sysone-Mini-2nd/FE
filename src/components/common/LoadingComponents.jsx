// 로딩 스피너 컴포넌트
export function LoadingSpinner({ message = "데이터를 불러오는 중..." }) {
  return (
    <div className="flex flex-col justify-center items-center py-8 space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <div className="text-gray-500 text-sm">{message}</div>
    </div>
  );
}

// 에러 경계 컴포넌트
export function ErrorFallback({ error, onRetry }) {
  return (
    <div className="flex flex-col justify-center items-center py-8 space-y-4">
      <div className="text-red-500 text-center">
        <div className="text-lg font-semibold mb-2">오류가 발생했습니다</div>
        <div className="text-sm">{error?.message || "알 수 없는 오류"}</div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}

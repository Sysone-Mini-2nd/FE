import { Replay } from "@mui/icons-material";

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
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex flex-col items-center py-8 space-y-4">
        <div className="text-red-500 text-center">
          <div className="text-xl font-semibold mb-2">오류가 발생했습니다</div>
          <div className="text-sm">{error?.message || "알 수 없는 오류"}</div>
        </div>
        {onRetry && (
          <button onClick={onRetry} className="text-amber-700 duration-300 hover:-rotate-180">
            <Replay fontSize="large" />
          </button>
        )}
      </div>
    </div>
  );
}
import { Replay, Warning} from "@mui/icons-material";
import { Skeleton } from "@mui/material";

// ProjectList용 Skeleton UI
export function ProjectListSkeleton({ count = 4 }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* 헤더 스켈레톤 */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <Skeleton variant="text" width={120} height={24} />
          <Skeleton variant="text" width={40} height={20} />
        </div>
      </div>

      {/* 프로젝트 목록 스켈레톤 */}
      <div className="divide-y divide-gray-100">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="p-4">
            {/* 프로젝트 헤더 */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <Skeleton variant="text" width="60%" height={20} className="mb-2" />
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    <Skeleton variant="circular" width={16} height={16} />
                    <Skeleton variant="text" width={30} height={16} />
                  </div>
                  <div className="flex items-center gap-1">
                    <Skeleton variant="circular" width={16} height={16} />
                    <Skeleton variant="text" width={50} height={16} />
                  </div>
                </div>
              </div>
              <Skeleton variant="rounded" width={40} height={24} />
            </div>

            {/* 진행률 스켈레톤 */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <Skeleton variant="text" width={40} height={16} />
                <Skeleton variant="text" width={30} height={16} />
              </div>
              <Skeleton variant="rounded" width="100%" height={8} />
            </div>

            {/* 마감일 및 팀원 스켈레톤 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Skeleton variant="circular" width={16} height={16} />
                <Skeleton variant="text" width={80} height={16} />
                <Skeleton variant="text" width={50} height={16} />
              </div>
              <div className="flex items-center gap-1">
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="circular" width={24} height={24} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export function LoadingSpinner({ message = "데이터를 불러오는 중..." }) {
  return (
    <div className="flex flex-col justify-center items-center py-8 space-y-4">
      <div className="animate-spin rounded-full h-40 w-40 border-b-2 border-red-500"></div>
      <div className="text-gray-500 text-sm">{message}</div>
    </div>
  );
}

// 에러 경계 컴포넌트
export function ErrorFallback({ error, onRetry }) {
  return (
    <div className="min-h-[50vh] bg-white rounded-lg shadow-sm flex items-center justify-center">
      <div className="flex flex-col items-center py-8 space-y-4">
        <div className="text-red-500 text-center">
          <Warning fontSize="large" className="text-yellow-500"/>
          <div className="text-xl font-semibold my-2">오류가 발생했습니다</div>
          <div className="text-sm">{error?.message || "알 수 없는 오류"}</div>
        </div>
        {onRetry && (
          <button onClick={onRetry} className="text-amber-700 duration-300 hover:-rotate-360">
            <Replay fontSize="large" />
          </button>
        )}
      </div>
    </div>
  );
}
import { Replay, Warning} from "@mui/icons-material";

// 기본 Skeleton 컴포넌트 - 개선된 애니메이션
export function SkeletonBox({ className = "", width = "w-full", height = "h-4" }) {
  return (
    <div 
      className={`rounded ${width} ${height} ${className}`}
      style={{
        background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s ease-in-out infinite'
      }}
    />
  );
}

// 회의 테이블용 Skeleton UI
export function MeetingTableSkeleton({ rows = 10 }) {
  // 제목 컬럼용 다양한 너비 배열
  const titleWidths = ['w-48', 'w-56', 'w-44', 'w-52', 'w-40'];
  
  return (
    <div className="bg-white border-y border-gray-200 overflow-hidden">
      <div>
        <table className="min-w-full">
          {/* 헤더 */}
          <thead className="border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                제목
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작성자
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                타입
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                진행 날짜
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                장소
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                참여 인원
              </th>
            </tr>
          </thead>
          
          {/* 스켈레톤 로우들 */}
          <tbody className="bg-white">
            {Array.from({ length: rows }).map((_, index) => (
              <tr 
                key={index} 
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } border-b border-gray-100`}
              >
                {/* 제목 컬럼 */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <SkeletonBox width="w-4" height="h-4" />
                    <div className="flex-1">
                      <SkeletonBox width={titleWidths[index % titleWidths.length]} height="h-4" />
                    </div>
                  </div>
                </td>
                
                {/* 작성자 컬럼 */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <SkeletonBox width="w-8" height="h-8" className="rounded-full" />
                    <SkeletonBox width="w-16" height="h-4" />
                  </div>
                </td>
                
                {/* 타입 컬럼 */}
                <td className="px-4 py-3">
                  <SkeletonBox width="w-20" height="h-6" className="rounded" />
                </td>
                
                {/* 진행 날짜 컬럼 */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <SkeletonBox width="w-4" height="h-4" />
                    <div>
                      <SkeletonBox width="w-24" height="h-4" className="mb-1" />
                      <SkeletonBox width="w-16" height="h-3" />
                    </div>
                  </div>
                </td>
                
                {/* 장소 컬럼 */}
                <td className="px-4 py-3">
                  <SkeletonBox width="w-20" height="h-4" />
                </td>
                
                {/* 참여 인원 컬럼 */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <SkeletonBox width="w-4" height="h-4" />
                    <SkeletonBox width="w-8" height="h-4" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 범용 테이블 Skeleton UI (다른 테이블에서도 사용 가능)
export function TableSkeleton({ 
  rows = 5, 
  columns = 4, 
  showHeader = true,
  headerTitles = []
}) {
  const defaultWidths = ['w-32', 'w-24', 'w-20', 'w-28', 'w-16'];
  
  return (
    <div className="bg-white border-y border-gray-200 overflow-hidden">
      <div>
        <table className="min-w-full">
          {/* 헤더 */}
          {showHeader && (
            <thead className="border-b border-gray-200">
              <tr>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <th 
                    key={colIndex}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {headerTitles[colIndex] || (
                      <SkeletonBox width="w-16" height="h-4" />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          
          {/* 스켈레톤 로우들 */}
          <tbody className="bg-white">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={`${
                  rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } border-b border-gray-100`}
              >
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-3">
                    <SkeletonBox 
                      width={defaultWidths[colIndex % defaultWidths.length]} 
                      height="h-4" 
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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
    <div className="min-h-[50vh] flex items-center justify-center">
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
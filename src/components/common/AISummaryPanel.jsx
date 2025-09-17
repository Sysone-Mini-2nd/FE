import React from 'react';
/** 작성자: 김대호, 배지원 */
function AISummaryPanel({ 
  summary, 
  title = "AI 정리", 
  className = "bg-gray-100 rounded-lg p-6 border border-gray-200",
}) {
  // summary가 없거나 빈 객체인 경우 기본값 설정
  if (!summary || typeof summary !== 'object') {
    return (
      <div className="sticky top-6">
        <div className={className}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <div className="text-sm text-gray-500 text-center py-8">
            AI 요약 정보가 없습니다.
          </div>
        </div>
      </div>
    );
  }

  // 서버에서 받은 데이터 구조에 맞게 처리
  const { mainTopics = [], decisions = [], priorities = [], recommends = [] } = summary;

  return (
    <div className="sticky top-6">
      <div className={className}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>

        <div className="space-y-6">
          {/* 주요 안건 */}
          {mainTopics && mainTopics.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                📝 주요 안건
              </h4>
              <ul className="space-y-1">
                {mainTopics.map((topic, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 결정 사항 */}
          {decisions && decisions.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                ✅ 결정 사항
              </h4>
              <ul className="space-y-1">
                {decisions.map((decision, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {decision}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 액션 아이템 */}
          {priorities && priorities.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                📋 우선 사항
              </h4>
              <ul className="space-y-2">
                {priorities.map((priority, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <span className="leading-relaxed">{priority}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 추천 아이템 */}
          {recommends && recommends.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                👍 추천 업무
              </h4>
              <ul className="space-y-2">
                {recommends.map((recommand, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <span className="leading-relaxed">{recommand}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 모든 데이터가 없는 경우 */}
          {(!mainTopics || mainTopics.length === 0) && 
           (!decisions || decisions.length === 0) && 
           (!priorities || priorities.length === 0) &&
           (!recommends || recommends.length === 0) && (
            <div className="text-sm text-gray-500 text-center py-4">
              AI 요약 정보가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AISummaryPanel;
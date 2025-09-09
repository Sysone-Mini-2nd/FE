import React from 'react';

function AISummaryPanel({ 
  summary, 
  title = "AI 정리", 
  className = "bg-gray-100 rounded-lg p-6 border border-gray-200",
  
  
}) {
  const defaultSummary = `
                    
임시 예시 텍스트:

📝 주요 안건
• 고객 마케팅을 위한 앱 개선 방안 논의
• 신규 기능 개발 일정 조율
• 팀 간 협업 프로세스 개선

✅ 결정 사항
• UI/UX 개선안 3월 말까지 완료
• 백엔드 API 연동 4월 초 시작
• 주간 스탠드업 미팅 화요일 오전 10시로 변경

📋 액션 아이템
• 박서호: 프론트엔드 컴포넌트 설계 (3/25까지)
• 이지민: 디자인 시스템 업데이트 (3/28까지)
• 최우식: 요구사항 문서 작성 (3/30까지)`;

  return (
    <div className="sticky top-6">
      <div className={className}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
            {summary || defaultSummary}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AISummaryPanel;

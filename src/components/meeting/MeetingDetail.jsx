import { useState } from "react";
import {
  ArrowBack,
  CalendarToday,
  People,
  LocationOn,
  PlayArrow,
  Pause,
  Edit,
  Delete,
  Check
} from "@mui/icons-material";

function MeetingDetail({ meeting, onBack, onEdit, onDelete }) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!meeting) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">회의 정보를 찾을 수 없습니다.</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 타입 배지 스타일
  const getTypeBadge = (type) => {
    const typeConfig = {
      "Daily Scrum": {
        label: "Daily Scrum",
        className: "bg-purple-100 text-purple-800",
      },
      "Sprint Planning Meeting": {
        label: "Sprint Planning",
        className: "bg-indigo-100 text-indigo-800",
      },
      "Sprint Review": {
        label: "Sprint Review",
        className: "bg-green-100 text-green-800",
      },
      "Sprint Retrospective": {
        label: "Sprint Retro",
        className: "bg-orange-100 text-orange-800",
      },
      기타: { label: "기타", className: "bg-gray-100 text-gray-800" },
    };
    const config = typeConfig[type] || typeConfig["기타"];
    return (
      <span
        className={`px-3 py-1 text-sm font-medium rounded-full ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  // 날짜 포맷팅
  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    const dateStr = date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
    const timeStr = date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { dateStr, timeStr };
  };

  const { dateStr, timeStr } = formatDateTime(meeting.scheduledDate);

  // 오디오 재생/일시정지 (실제 오디오 파일이 있다면)
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // 실제 구현에서는 audioRef를 사용하여 재생/일시정지
  };

  // 삭제 확인
  const handleDelete = () => {
    if (window.confirm("이 회의록을 삭제하시겠습니까?")) {
      onDelete(meeting);
    }
  };

  return (
    <div className="min-h-full">
      {/* 헤더 */}
      <div className="pb-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors mt-1"
            >
              <ArrowBack className="w-7 h-7 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900">
                {meeting.title}
              </h1>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <CalendarToday fontSize="small"/>
                  <span>
                    {dateStr} {timeStr}
                  </span>
                </div>
                {meeting.location && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <LocationOn className="w-4 h-4" />
                    <span>{meeting.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  {getTypeBadge(meeting.type)}
                  <span className="text-sm text-gray-800">
                    작성자: {meeting.organizer}
                  </span>
                </div>
              </div>

              {/* 참석자 정보 */}
                <div className="flex items-center gap-2">
                  <People className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    참석자 ({meeting.participants?.length || 0}명)
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                    {meeting.participants?.map((participant, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
                      >
                        <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-xs font-medium text-white">
                          {participant.slice(0, 1)}
                        </div>
                        <span className="text-xs text-gray-700">
                          {participant}
                        </span>
                      </div>
                    )) || (
                      <p className="col-span-full text-sm text-gray-500">
                        참석자 정보가 없습니다.
                      </p>
                    )}
                  </div>
                </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onEdit(meeting)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              편집
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <Delete className="w-4 h-4" />
              삭제
            </button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex gap-6 mt-2">
        <div className="flex-[3] space-y-4">
          {/* 회의 내용 */}
          <div>
            <h2 className="text-xl font-semibold mb-2">회의 내용</h2>
            <div className="rounded-lg p-4 border border-gray-400">
              <p className="whitespace-pre-wrap leading-relaxed text-lg">
                {meeting.description ||
                  meeting.memo ||
                  "회의 내용이 기록되지 않았습니다."}
              </p>
            </div>
          </div>

          {/* 녹음 파일 (있는 경우) */}
          {meeting.audioFile && (
            <div>
              <h2 className="text-lg font-semibold mb-4">녹음 파일</h2>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                <button
                  onClick={togglePlayback}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <PlayArrow className="w-4 h-4" />
                  )}
                  {isPlaying ? "일시정지" : "재생"}
                </button>
                <div>
                  <p className="text-sm">회의 녹음</p>
                  <p className="text-xs">
                    {new Date(meeting.createdAt).toLocaleDateString("ko-KR")}{" "}
                    녹음
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 메타 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span>작성자:</span>
              <span className="ml-2">{meeting.organizer}</span>
            </div>
            <div>
              <span>생성일:</span>
              <span className="ml-2">
                {meeting.createdAt
                  ? new Date(meeting.createdAt).toLocaleDateString("ko-KR")
                  : new Date(meeting.scheduledDate).toLocaleDateString("ko-KR")}
              </span>
            </div>
            <div>
              <span>회의 ID:</span>
              <span className="ml-2">#{meeting.id}</span>
            </div>
            <div>
              <span>상태:</span>
              <span className="text-green-400 ml-2">완료</span>
            </div>
          </div>
        </div>

        {/* 우측 영역 (2/5) - AI 정리 창 */}
        <div className="flex-[2] mt-9">
          <div className="sticky top-6">
            <div className="bg-gray-100 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900"> AI 정리</h3>
              </div>

              <div className="space-y-4">
                <div className="text-sm text-gray-600 leading-relaxed">
                  {meeting.aiSummary ||
                    `회의 내용을 AI가 정리 중입니다. 잠시만 기다려주세요...
                    
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
                    • 최우식: 요구사항 문서 작성 (3/30까지)`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeetingDetail;

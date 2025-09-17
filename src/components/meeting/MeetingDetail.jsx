import { useState } from "react";
import {
  ArrowBack,
  CalendarToday,
  LocationOn,
  Edit,
  Delete,
  Email,
  Article,
} from "@mui/icons-material";
import { downloadMeetingReport } from "../../api/meetingAPI";

import BadgeComponent from "../common/BadgeComponent";
import ParticipantList from "../common/ParticipantList";
import MeetingMetadata from "../common/MeetingMetadata";
import AudioPlayer from "../common/AudioPlayer";
import AISummaryPanel from "../common/AISummaryPanel";
import { useToast } from "../../hooks/useToast";
import EmailSendModal from "./EmailSendModal";
/** 작성자: 김대호, 배지원 */
function MeetingDetail({ meeting, onBack, onEdit, onDelete }) {
  // Toast hook
  const { showError } = useToast();

    // 다운로드 상태 추가
  const [isDownloading, setIsDownloading] = useState(false);

    // 이메일 전송 모달 상태 추가
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

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

  // 이메일 전송 핸들러 함수 추가
  const handleEmailSend = () => {
    if (!meeting?.projectId || !meeting?.id) {
      showError("프로젝트 ID 또는 회의 ID가 없습니다.");
      return;
    }
    setIsEmailModalOpen(true);
  };

  //  다운로드 핸들러 함수 추가 (handleDelete 함수 아래에 추가)
  const handleDownloadReport = async () => {
    if (!meeting?.projectId || !meeting?.id) {
      showError("프로젝트 ID 또는 회의 ID가 없습니다.");
      return;
    }
    
    setIsDownloading(true);
    try {
      const result = await downloadMeetingReport(meeting.projectId, meeting.id);
      // 성공 메시지는 부모 컴포넌트에서 처리하거나 여기서 처리
      console.log(`${result.fileName} 다운로드가 완료되었습니다.`);
    } catch (error) {
      console.error('다운로드 중 오류가 발생했습니다:', error);
      if (error.response?.status === 404) {
        showError("회의록을 찾을 수 없습니다.");
      } else if (error.response?.status === 500) {
        showError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } else {
        showError("다운로드 중 오류가 발생했습니다.");
      }
    } finally {
      setIsDownloading(false);
    }
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

  // 삭제 확인
  const handleDelete = async () => {
    try {
      await onDelete(meeting);
      // showSuccess는 부모 컴포넌트에서 처리
    } catch (error) {
      console.error('삭제 실패:', error);
      showError("회의록 삭제 중 오류가 발생했습니다.");
    }
  };

  // 메타데이터 구성
  const metadataItems = [
    { label: "작성자", value: meeting.organizer },
    {
      label: "생성일",
      value: meeting.createdAt
        ? new Date(meeting.createdAt).toLocaleDateString("ko-KR")
        : new Date(meeting.scheduledDate).toLocaleDateString("ko-KR"),
    },
    { label: "회의 ID", value: `#${meeting.id}` },
    { label: "상태", value: "완료", className: "text-green-400" },
  ];

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
                  <CalendarToday fontSize="small" />
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
                  <BadgeComponent type={meeting.type} />
                  <span className="text-sm text-gray-800">
                    작성자: {meeting.organizer}
                  </span>
                </div>
              </div>

              {/* 참석자 정보 */}
              <ParticipantList participants={meeting.participants} />
            </div>
          </div>

          <div className="flex flex-col items-end gap-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onEdit(meeting)}
                className="editBtn"
              >
                <Edit/>
                편집
              </button>
              <button
                onClick={handleDelete}
                className="deleteBtn"
              >
                <Delete />
                삭제
              </button>
            </div>

            <div className="flex items-center gap-3">
            <button
                onClick={handleDownloadReport}
                disabled={isDownloading}
                className={`px-4 py-2 text-black hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2 ${
                  isDownloading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Article />
                {isDownloading ? '다운로드 중...' : 'AI 리포트 생성'}
              </button>
              <button
                onClick={() => {
                  /* 다운로드 기능 추가 */
                }}
                className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-2"
              >
              </button>
              <button
              onClick={handleEmailSend}
              className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-2"
            >   
              <Email />
              이메일 전송
            </button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3">
          {/* 회의 내용 */}
          <div className="rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">회의 내용</h2>
            <div className="rounded-lg p-4 border border-gray-200 bg-gray-50">
              <p className="whitespace-pre-wrap leading-relaxed text-gray-700 break-words">
                {meeting.content ||
                  meeting.description ||
                  meeting.memo ||
                  "회의 내용이 기록되지 않았습니다."}
              </p>
            </div>
          </div>

          {/* 녹음 파일 (있는 경우) */}
          {/* <div className="rounded-lg p-6">
            <AudioPlayer
              audioFile={meeting.audioFile}
              createdAt={meeting.createdAt}
            />
          </div> */}

          {/* 메타 정보 */}
          <div className="rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">회의 정보</h2>
            <MeetingMetadata data={metadataItems} />
          </div>
        </div>

        {/* 우측 영역 - AI 정리 창 */}
        <div className="col-span-2">
          <div className="rounded-lg mt-16">
            <AISummaryPanel summary={meeting.summary} />
          </div>
        </div>
      </div>
      
      {/* 이메일 전송 모달 */}
      <EmailSendModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        projectId={meeting?.projectId}
        meetingId={meeting?.id}
        meetingTitle={meeting?.title}
      />
    </div>
  );
}

export default MeetingDetail;

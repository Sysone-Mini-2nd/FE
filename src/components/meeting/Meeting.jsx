import React, { useState } from "react";
import { Add, Search, FilterList } from "@mui/icons-material";
import MeetingTable from "./MeetingTable";
import MeetingCreate from "./MeetingCreate";
import { meetingsData } from "../../data/meetings";

function Meeting() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showCreatePage, setShowCreatePage] = useState(false);
  const [meetings, setMeetings] = useState(meetingsData);

  // 필터링된 회의 목록
  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || meeting.type === filterType;

    return matchesSearch && matchesFilter;
  });

  // 테이블 액션 핸들러
  const handleMeetingAction = (action, meeting) => {
    switch (action) {
      case "view":
        console.log("회의 상세보기:", meeting);
        // 상세보기 모달이나 페이지로 이동
        break;
      case "edit":
        console.log("회의 편집:", meeting);
        // 편집 모달 열기
        break;
      case "delete":
        console.log("회의 삭제:", meeting);
        // 삭제 확인 다이얼로그
        break;
      default:
        break;
    }
  };

  function handleCreateMeeting() {
    setShowCreatePage(true);
  }

  // 회의 생성 페이지에서 돌아가기
  const handleBackToList = () => {
    setShowCreatePage(false);
  };

  // 회의 저장
  const handleSaveMeeting = (meetingData) => {
    const newMeeting = {
      id: meetings.length + 1,
      title: meetingData.title,
      organizer: '현재 사용자', // 실제로는 로그인한 사용자 정보
      type: '기타',
      scheduledDate: new Date().toISOString(),
      location: meetingData.location,
      participants: meetingData.participants,
      description: meetingData.memo,
      audioFile: meetingData.audioFile,
      createdAt: meetingData.createdAt
    };

    setMeetings(prev => [newMeeting, ...prev]);
    setShowCreatePage(false);
    
    console.log('새 회의록이 저장되었습니다:', newMeeting);
  };

  return (
    <div>
      {showCreatePage ? (
        <MeetingCreate 
          onBack={handleBackToList}
          onSave={handleSaveMeeting}
        />
      ) : (
        <>
          {/* 헤더 */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">회의록</h3>
            </div>
            <div>
              <div className="rounded-lg p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* 검색 */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="회의 제목이나 작성자로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* 필터 */}
                  <div className="flex items-center gap-2">
                    <FilterList className="text-gray-400 w-4 h-4" />
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">모든 타입</option>
                      <option value="Daily Scrum">Daily Scrum</option>
                      <option value="Sprint Planning Meeting">
                        Sprint Planning
                      </option>
                      <option value="Sprint Review">Sprint Review</option>
                      <option value="Sprint Retrospective">
                        Sprint Retrospective
                      </option>
                    </select>
                  </div>
                  <button
                    onClick={handleCreateMeeting}
                    className="createBtn"
                  >
                    <Add className="w-4 h-4" />
                    회의 생성
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 검색 및 필터 */}

          {/* 회의 테이블 */}
          <MeetingTable
            meetings={filteredMeetings}
            onAction={handleMeetingAction}
          />
        </>
      )}
    </div>
  );
}

export default Meeting;

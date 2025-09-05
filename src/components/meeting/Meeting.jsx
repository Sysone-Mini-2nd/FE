import React, { useState } from "react";
import { Add, Search, FilterList } from "@mui/icons-material";
import MeetingTable from "./MeetingTable";

function Meeting() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // 샘플 회의 데이터 (실제로는 API에서 가져올 데이터)
  const sampleMeetings = [
    {
      id: 1,
      title: "데일리 스크럼",
      organizer: "홍길동",
      type: "Daily Scrum",
      scheduledDate: "2025-10-12T10:15:00",
      location: "제 1회의실",
      participants: ["홍길동", "김철수", "이영희"],
      description: "일일 스탠드업 미팅",
    },
    {
      id: 2,
      title: "고객 마케팅을 위한 앱 개선",
      organizer: "홍길동",
      type: "Sprint Planning Meeting",
      scheduledDate: "2025-10-12T10:15:00",
      location: "제 2회의실",
      participants: ["홍길동", "김철수", "이영희"],
      description: "스프린트 계획 수립",
    },
    {
      id: 3,
      title: "데일리 스크럼",
      organizer: "홍길동",
      type: "Sprint Review",
      scheduledDate: "2025-10-05T10:15:00",
      location: "제 1회의실",
      participants: ["홍길동", "김철수"],
      description: "스프린트 리뷰",
    },
    {
      id: 4,
      title: "데일리 스크럼",
      organizer: "홍길동",
      type: "Sprint Retrospective",
      scheduledDate: "2025-10-01T10:15:00",
      location: "대회의실",
      participants: [
        "홍길동",
        "김철수",
        "이영희",
        "박민수",
        "최수진",
        "정대현",
        "서지원",
        "강호동",
        "유재석",
        "박나래",
      ],
      description: "스프린트 회고",
    },
    {
      id: 5,
      title: "데일리 스크럼",
      organizer: "홍길동",
      type: "Daily Scrum",
      scheduledDate: "2025-09-12T10:15:00",
      location: "제 1회의실",
      participants: ["홍길동", "김철수", "이영희"],
      description: "일일 스탠드업 미팅",
    },
    {
      id: 6,
      title: "데일리 스크럼",
      organizer: "홍길동",
      type: "Daily Scrum",
      scheduledDate: "2025-08-12T10:15:00",
      location: "제 1회의실",
      participants: ["홍길동", "김철수", "이영희"],
      description: "일일 스탠드업 미팅",
    },
  ];

  // 필터링된 회의 목록
  const filteredMeetings = sampleMeetings.filter((meeting) => {
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

  const handleCreateMeeting = () => {
    console.log("새 회의록 생성");
    // 새 회의록 생성 모달 열기
  };

  return (
    <div className="p-6">
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
                className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
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
    </div>
  );
}

export default Meeting;

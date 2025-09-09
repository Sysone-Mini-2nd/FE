import { useState } from "react";
import { Add, Search, FilterList } from "@mui/icons-material";
import MeetingTable from "./MeetingTable";
import MeetingCreate from "./MeetingCreate";
import MeetingDetail from "./MeetingDetail";
import Dropdown from "../common/Dropdown";
import useMeetingStore from "../../store/meetingStore";
import { currentUser } from "../../data/userData";

function Meeting() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Zustand store 사용
  const { 
    meetings, 
    currentView, 
    selectedMeeting,
    selectMeeting,
    showList,
    showCreate,
    addMeeting,
    deleteMeeting 
  } = useMeetingStore();

  // 필터링된 회의 목록
  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || meeting.type === filterType;

    return matchesSearch && matchesFilter;
  });

  // 간단해진 액션 핸들러들
  const handleMeetingAction = (action, meeting) => {
    switch (action) {
      case "view":
        selectMeeting(meeting);
        break;
      case "edit":
        console.log("회의 편집:", meeting);
        break;
      case "delete":
        if (window.confirm("이 회의록을 삭제하시겠습니까?")) {
          deleteMeeting(meeting.id);
        }
        break;
    }
  };

  const handleSaveMeeting = (meetingData) => {
    const newMeeting = {
      title: meetingData.title,
      organizer: currentUser.name,
      type: '기타',
      scheduledDate: new Date().toISOString(),
      location: meetingData.location,
      participants: meetingData.participants,
      description: meetingData.memo,
      audioFile: meetingData.audioFile,
      createdAt: meetingData.createdAt
    };
    addMeeting(newMeeting);
  };

  // 필터 옵션 정의
  const filterOptions = [
    { value: "all", label: "모든 타입" },
    { value: "Daily Scrum", label: "Daily Scrum" },
    { value: "Sprint Planning Meeting", label: "Sprint Planning" },
    { value: "Sprint Review", label: "Sprint Review" },
    { value: "Sprint Retrospective", label: "Sprint Retrospective" }
  ];

  return (
    <div>
      {currentView === 'create' ? (
        <MeetingCreate 
          onBack={showList}
          onSave={handleSaveMeeting}
        />
      ) : currentView === 'detail' ? (
        <MeetingDetail
          meeting={selectedMeeting}
          onBack={showList}
          onEdit={(meeting) => console.log("편집:", meeting)}
          onDelete={(meeting) => deleteMeeting(meeting.id)}
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
                    <Dropdown
                      options={filterOptions}
                      value={filterType}
                      onChange={setFilterType}
                      width="w-48"
                      placeholder="타입 선택"
                    />
                  </div>
                  <button
                    onClick={showCreate}
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

import { useState, useEffect, Suspense } from "react";
import { Add, Search, FilterList } from "@mui/icons-material";
import MeetingTable from "./MeetingTable";
import MeetingCreate from "./MeetingCreate";
import MeetingDetail from "./MeetingDetail";
import Dropdown from "../common/Dropdown";
import { LoadingSpinner, ErrorFallback } from "../common/loading/LoadingComponents";
import useMeetingStore from "../../store/meetingStore";
import { useToast } from "../../hooks/useToast";

function Meeting() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Zustand store 사용
  const { 
    meetings, 
    currentView, 
    selectedMeeting,
    loading,
    error,
    pagination,
    fetchMeetings,
    selectMeeting,
    showList,
    showCreate,
    showEdit,
    deleteMeeting,
    refreshAfterCreate,
    changePage
  } = useMeetingStore();

  // Toast hook
  const { showSuccess, showError } = useToast();

  // 컴포넌트 마운트 시 회의록 목록 조회
  useEffect(() => {
    fetchMeetings(1); // 프로젝트 ID 1로 고정
  }, [fetchMeetings]);

  // 필터링된 회의 목록
  const filteredMeetings = meetings.filter((meeting) => {
    // 안전한 문자열 처리 - undefined/null 체크
    const title = meeting.title || '';
    const organizer = meeting.organizer || '';
    
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || meeting.type === filterType;

    return matchesSearch && matchesFilter;
  });

  // 삭제 확인 함수
  const handleDeleteConfirm = async (meeting) => {
    try {
      await deleteMeeting(meeting.id);
      showSuccess("회의록이 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error('삭제 실패:', error);
      showError("회의록 삭제 중 오류가 발생했습니다.");
    }
  };

  // 간단해진 액션 핸들러들
  const handleMeetingAction = (action, meeting) => {
    switch (action) {
      case "view":
        selectMeeting(meeting);
        break;
      case "edit":
        showEdit(meeting);
        break;
    }
  };

  const handleSaveMeeting = async (apiResponse) => {
    try {
      console.log('handleSaveMeeting 호출됨, API 응답:', apiResponse);
      
      // 회의록 생성 후 목록 새로고침
      await refreshAfterCreate(1);
      
    } catch (error) {
      console.error('handleSaveMeeting 에러:', error);
      throw error;
    }
  };

  const handleUpdateMeeting = async (apiResponse) => {
    try {
      console.log('handleUpdateMeeting 호출됨, API 응답:', apiResponse);
      
      // 회의록 수정 후 목록 새로고침
      await fetchMeetings(1, pagination.page, pagination.size);
      showList();
      
    } catch (error) {
      console.error('handleUpdateMeeting 에러:', error);
      throw error;
    }
  };

  // 필터 옵션을 서버 응답에 맞게 수정
  const filterOptions = [
    { value: "all", label: "모든 타입" },
    { value: "SCRUM", label: "Daily Scrum" },
    { value: "MEETING", label: "MEETING" },
    { value: "REVIEW", label: "Sprint Review" },
    { value: "RETROSPECTIVE", label: "Sprint Retrospective" }
  ];

  return (
    <div>
      {currentView === 'create' ? (
        <MeetingCreate 
          onBack={showList}
          onSave={handleSaveMeeting}
        />
      ) : currentView === 'edit' ? (
        <MeetingCreate 
          onBack={showList}
          onSave={handleUpdateMeeting}
          meeting={selectedMeeting}
          isEditing={true}
        />
      ) : currentView === 'detail' ? (
        <MeetingDetail
          meeting={selectedMeeting}
          onBack={showList}
          onEdit={(meeting) => showEdit(meeting)}
          onDelete={handleDeleteConfirm}
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
                    <FilterList className="text-gray-400" />
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
                    <Add />
                    회의 생성
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 회의 테이블 */}
          {error ? (
            <ErrorFallback 
              error={{ message: error }}
              onRetry={() => fetchMeetings(1)}
            />
          ) : (
            <>
              <MeetingTable
                meetings={filteredMeetings}
                onAction={handleMeetingAction}
                loading={loading}
              />
              
              {/* 페이지네이션 - 로딩 중이 아닐 때만 표시 */}
              {!loading && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <button
                    onClick={() => changePage(pagination.page - 1)}
                    disabled={!pagination.hasPrevious}
                    className="px-3 py-1 rounded border disabled:opacity-50"
                  >
                    이전
                  </button>
                  <span className="px-3 py-1">
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => changePage(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                    className="px-3 py-1 rounded border disabled:opacity-50"
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Meeting;

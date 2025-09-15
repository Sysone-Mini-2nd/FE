import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowBack, Mic, Stop, PlayArrow, Pause } from "@mui/icons-material";
import { employeesData } from "../../data/employees";
import Dropdown from '../common/Dropdown';
import { LoadingSpinner } from '../common/loading/LoadingComponents';
import { useCreateMeeting, useUpdateMeeting } from '../../hooks/useMeetingQueries';
import { useToast } from '../../hooks/useToast';
import { getProjectParticipants } from '../../api/meetingAPI';

function MeetingCreate({ onBack, onSave, meeting = null, isEditing = false, projectId }) {
  const [meetingData, setMeetingData] = useState({
    title: meeting?.title || "",
    place: meeting?.location || meeting?.place || "",
    participants: meeting?.participants || [],
    content: meeting?.description || meeting?.memo || meeting?.content || "",
    type: meeting?.type || "MEETING",
    progressDate: meeting?.progressDate || new Date().toISOString().slice(0, -1) + '+09:00',
  });

  console.log('MeetingCreate에서 받은 projectId:', projectId);
  console.log('projectId 타입:', typeof projectId);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showParticipantDropdown, setShowParticipantDropdown] = useState(false);

  // 팀 인원 데이터 상태 추가
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // React Query mutations
  const createMutation = useCreateMeeting();
  const updateMutation = useUpdateMeeting();
  
  // Toast hook
  const { showSuccess, showError } = useToast();

  // 현재 진행 중인 mutation이 있는지 확인
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const meetingTypeOptions = [
    { value: 'SCRUM', label: 'Daily Scrum' },
    { value: 'MEETING', label: '일반 회의' },
    { value: 'REVIEW', label: 'Sprint Review' },
    { value: 'RETROSPECTIVE', label: 'Sprint Retrospective' }
  ];

  // 팀 인원 조회 함수 추가
  const fetchTeamMembers = useCallback(async () => {
    setIsLoadingMembers(true);
    try {
      const response = await getProjectParticipants(projectId);
      
      if (response.statusCode === 200) {
        // 서버 응답 데이터를 컴포넌트에서 사용할 수 있는 형태로 변환
        const members = response.data.map(member => ({
          id: member.memberId || member.id,
          name: member.memberName || member.name,
          email: member.email,
          department: member.department,
          position: member.position
        }));
        setTeamMembers(members);
      }
    } catch (error) {
      console.error('팀 인원 조회 실패:', error);
      showError('팀 인원 정보를 불러오는데 실패했습니다.');
      // 실패 시 기본 데이터 사용
      setTeamMembers(employeesData);
    } finally {
      setIsLoadingMembers(false);
    }
  }, [projectId, showError]);

  // 컴포넌트 마운트 시 팀 인원 조회
  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  // 입력값 변경 핸들러
  const handleInputChange = (field, value) => {
    setMeetingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 참석자 선택/해제 - 팀 인원 데이터 사용
  const toggleParticipant = (member) => {
    setMeetingData((prev) => ({
      ...prev,
      participants: prev.participants.includes(member.id)
        ? prev.participants.filter((id) => id !== member.id)
        : [...prev.participants, member.id],
    }));
  };

  // 녹음 시작
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        setAudioBlob(audioBlob);

        // 스트림 정리
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // 녹음 시간 타이머
      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("마이크 접근 권한이 필요합니다:", error);
      showError("마이크 접근 권한이 필요합니다.");
    }
  };

  // 녹음 종료
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(intervalRef.current);
    }
  };

  // 오디오 재생/일시정지
  const togglePlayback = () => {
    if (!audioBlob) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(URL.createObjectURL(audioBlob));
        audioRef.current.onended = () => setIsPlaying(false);
      }
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // 시간 포맷팅
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // 저장 핸들러 - React Query mutations 사용
  const handleSave = async () => {
    if (!meetingData.title.trim()) {
      showError("제목을 입력해주세요.");
      return;
    }

    // API 요청에 필요한 데이터 형태로 변환
    const requestData = {
      title: meetingData.title,
      content: meetingData.content,
      type: meetingData.type,
      progressDate: meetingData.progressDate,
      place: meetingData.place,
      participantIds: meetingData.participants
    };

    try {
      let result;
      if (isEditing && meeting?.id) {
        // 수정 모드 - 오디오 파일 전송
        result = await updateMutation.mutateAsync({
          projectId,
          meetingId: meeting.id,
          meetingData: requestData,
          audioFile: audioBlob // 오디오 파일 추가
        });
        showSuccess("회의록이 성공적으로 수정되었습니다.");
      } else {
        // 생성 모드 - 오디오 파일 전송
        result = await createMutation.mutateAsync({
          projectId,
          meetingData: requestData,
          audioFile: audioBlob // 오디오 파일 추가
        });
        showSuccess("회의록이 성공적으로 저장되었습니다.");
      }

      console.log('API 응답:', result); // 응답 확인용 로그
      console.log('전송된 오디오 파일:', audioBlob); // 오디오 파일 확인용 로그
      console.log('API 응답:', result); // 응답 확인용 로그

      // 성공 시 콜백 호출
      try {
        onSave && onSave(result); // 응답 데이터를 콜백에 전달
      } catch (callbackError) {
        console.error('onSave 콜백 에러:', callbackError);
        // 콜백 에러는 사용자에게 알리지 않고 콘솔에만 로그
      }
    } catch (error) {
      console.error('API Error:', error);
      showError("회의록 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="min-h-full">
      {/* 로딩 중일 때 전체 화면 오버레이 */}
      {isLoading && (
        <div className="modal">
          <div className="rounded-lg p-6">
            <LoadingSpinner 
              message={isEditing ? "회의록을 수정하는 중..." : "회의록을 저장하는 중..."} 
            />
          </div>
        </div>
      )}

      {/* 헤더 */}
      <div>
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <ArrowBack className="w-7 h-7 text-gray-600" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              disabled={isLoading}
              className="cancelBtn"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isLoading 
                  ? 'cancelBtn' 
                  : 'createBtn'
              }`}
            >
              {isLoading ? '처리중...' : isEditing ? '수정' : '저장'}
            </button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div>
        <div className="">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {isEditing ? "회의록 편집" : "회의록 생성"}
          </h2>

          <div className="space-y-6">
            {/* 제목과 회의실 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목
                </label>
                <input
                  type="text"
                  value={meetingData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="회의 제목을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  회의실
                </label>
                <input
                  type="text"
                  value={meetingData.place}
                  onChange={(e) =>
                    handleInputChange("place", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="회의실을 입력하세요"
                />
              </div>
            </div>

            {/* 회의 인원과 회의 타입 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  회의 인원
                </label>
                <div className="relative">
                  <button
                    onClick={() =>
                      setShowParticipantDropdown(!showParticipantDropdown)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left hover:bg-gray-50 flex items-center justify-between"
                  >
                    <span className="text-gray-500">
                      {meetingData.participants.length > 0
                        ? `${meetingData.participants.length}명 선택됨`
                        : "회의 참석자를 선택하세요"}
                    </span>
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {showParticipantDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {isLoadingMembers ? (
                        <div className="p-4 text-center text-gray-500">
                          <LoadingSpinner message="팀 인원을 불러오는 중..." />
                        </div>
                      ) : (
                        <div className="py-1">
                          {teamMembers.map((member) => (
                            <button
                              key={member.id}
                              type="button"
                              onClick={() => toggleParticipant(member)}
                              className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between ${
                                meetingData.participants.includes(member.id)
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'text-gray-700'
                              }`}
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">{member.name}</span>
                                {member.department && (
                                  <span className="text-sm text-gray-500">{member.department}</span>
                                )}
                                {member.position && (
                                  <span className="text-sm text-gray-500">{member.position}</span>
                                )}
                              </div>
                              {meetingData.participants.includes(member.id) && (
                                <svg
                                  className="w-5 h-5 text-blue-600"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 선택된 참석자 표시 - 팀 인원 데이터 사용 */}
                {meetingData.participants.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {meetingData.participants.map((participantId) => {
                      const participant = teamMembers.find(member => member.id === participantId);
                      return participant ? (
                        <span
                          key={participantId}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {participant.name}
                          <button
                            type="button"
                            onClick={() => toggleParticipant(participant)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              {/* 회의 타입 */}
              <div>
                <label className="block w-full text-sm font-medium text-gray-700 mb-2">
                  회의 타입
                </label>
                <Dropdown
                  options={meetingTypeOptions}
                  value={meetingData.type}
                  onChange={(value) => handleInputChange("type", value)}
                  placeholder="회의 타입을 선택하세요"
                  width="w-full"
                />
              </div>
            </div>

            {/* 메모를 content로 변경 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                회의 내용
              </label>
              <textarea
                value={meetingData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="회의 내용을 입력하세요"
              />
            </div>

            {/* 음성 녹음 */}
            <div className="text-center">
              <div>
                {!isRecording && !audioBlob && (
                  <button
                    onClick={startRecording}
                    className="inline-flex items-center gap-2 px-6 py-6 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <Mic />
                  </button>
                )}

                {isRecording && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-lg font-black">
                        {formatTime(recordingTime)}
                      </span>
                    </div>
                    <button
                      onClick={stopRecording}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                    >
                      <Stop className="w-5 h-5" />
                      녹음 종료
                    </button>
                  </div>
                )}

                {audioBlob && !isRecording && (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                      녹음이 완료되었습니다. ({formatTime(recordingTime)})
                    </div>
                    <button
                      onClick={togglePlayback}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <PlayArrow className="w-4 h-4" />
                      )}
                      {isPlaying ? "일시정지" : "재생"}
                    </button>
                    <button
                      onClick={startRecording}
                      className="ml-2 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      다시 녹음
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeetingCreate;
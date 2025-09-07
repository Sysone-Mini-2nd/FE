import React, { useState, useRef } from 'react';
import { ArrowBack, Mic, Stop, PlayArrow, Pause } from '@mui/icons-material';
import { employeesData } from '../../data/employees';

function MeetingCreate({ onBack, onSave }) {
  const [meetingData, setMeetingData] = useState({
    title: '',
    location: '',
    participants: [],
    memo: ''
  });

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showParticipantDropdown, setShowParticipantDropdown] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // 입력값 변경 핸들러
  const handleInputChange = (field, value) => {
    setMeetingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 참석자 선택/해제
  const toggleParticipant = (employee) => {
    setMeetingData(prev => ({
      ...prev,
      participants: prev.participants.includes(employee.name)
        ? prev.participants.filter(name => name !== employee.name)
        : [...prev.participants, employee.name]
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
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        
        // 스트림 정리
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // 녹음 시간 타이머
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('마이크 접근 권한이 필요합니다:', error);
      alert('마이크 접근 권한이 필요합니다.');
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
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 저장 핸들러
  const handleSave = () => {
    if (!meetingData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    const meetingToSave = {
      ...meetingData,
      audioFile: audioBlob,
      createdAt: new Date().toISOString()
    };

    onSave(meetingToSave);
  };

  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <div>
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowBack className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-400 text-white rounded-lg transition-colors"
              >
                저장
              </button>
            </div>
          </div>

      </div>

      {/* 메인 컨텐츠 */}
      <div>
        <div className="">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">회의록 생성</h2>

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
                  onChange={(e) => handleInputChange('title', e.target.value)}
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
                  value={meetingData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="회의실을 입력하세요"
                />
              </div>
            </div>

            {/* 회의 인원 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                회의 인원
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowParticipantDropdown(!showParticipantDropdown)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
                >
                  <span className="text-gray-500">
                    {meetingData.participants.length > 0 
                      ? `${meetingData.participants.length}명 선택됨` 
                      : '회의 참석자를 선택하세요'
                    }
                  </span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showParticipantDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {employeesData.map((employee) => (
                      <div
                        key={employee.id}
                        className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleParticipant(employee)}
                      >
                        <input
                          type="checkbox"
                          checked={meetingData.participants.includes(employee.name)}
                          onChange={() => {}}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          <div className="text-xs text-gray-500">{employee.department} · {employee.position}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 선택된 참석자 표시 */}
              {meetingData.participants.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {meetingData.participants.map((participant, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {participant}
                      <button
                        onClick={() => toggleParticipant({ name: participant })}
                        className="ml-1 hover:text-blue-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 메모 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                메모
              </label>
              <textarea
                value={meetingData.memo}
                onChange={(e) => handleInputChange('memo', e.target.value)}
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
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <Mic className="w-5 h-5" />
                    Start Recording
                  </button>
                )}

                {isRecording && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-lg font-mono">{formatTime(recordingTime)}</span>
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
                      {isPlaying ? <Pause className="w-4 h-4" /> : <PlayArrow className="w-4 h-4" />}
                      {isPlaying ? '일시정지' : '재생'}
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

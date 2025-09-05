import { Gantt, Willow, Toolbar } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";
import { useRef} from "react";

function GanttChart() {
  const apiRef = useRef();
  //목데이터 - 2025년 6월~9월, 최대 14일 기간
  const tasks = [
    {
      id: 1,
      text: "프로젝트 킥오프",
      details: "프로젝트 시작을 위한 팀 킥오프 미팅 및 목표 설정",
      start: new Date(2025, 5, 2),  // 2025년 6월 2일
      end: new Date(2025, 5, 6),    // 2025년 6월 6일
      duration: 5,
      progress: 100,
      type: "task",
      priority: "high",
      assignee: "lee"
    },
    {
      id: 2,
      text: "요구사항 정의",
      details: "클라이언트 요구사항 수집 및 분석, 기능 명세서 작성",
      start: new Date(2025, 5, 9),  // 2025년 6월 9일
      end: new Date(2025, 5, 20),   // 2025년 6월 20일
      duration: 12,
      progress: 100,
      type: "task",
      priority: "critical",
      assignee: "lee"
    },
    {
      id: 3,
      text: "[주요] 시스템 개발 단계",
      details: "전체 시스템 개발을 포괄하는 주요 단계",
      start: new Date(2025, 5, 23), // 2025년 6월 23일
      end: new Date(2025, 8, 15),   // 2025년 9월 15일
      duration: 84,
      progress: 65,
      type: "summary",
      priority: "critical",
      assignee: "kim"
    },
    {
      id: 4,
      text: "UI/UX 프로토타입",
      details: "사용자 인터페이스 설계 및 프로토타입 제작",
      start: new Date(2025, 5, 23), // 2025년 6월 23일
      end: new Date(2025, 6, 7),    // 2025년 7월 7일
      duration: 14,
      progress: 90,
      parent: 3,
      type: "task",
      priority: "high",
      assignee: "park"
    },
    {
      id: 5,
      text: "데이터베이스 설계",
      start: new Date(2025, 6, 8),  // 2025년 7월 8일
      end: new Date(2025, 6, 18),   // 2025년 7월 18일
      duration: 11,
      progress: 80,
      parent: 3,
      type: "task",
    },
    {
      id: 6,
      text: "API 개발",
      start: new Date(2025, 6, 21), // 2025년 7월 21일
      end: new Date(2025, 7, 1),    // 2025년 8월 1일
      duration: 12,
      progress: 70,
      parent: 3,
      type: "task",
    },
    {
      id: 7,
      text: "프론트엔드 구현",
      start: new Date(2025, 7, 4),  // 2025년 8월 4일
      end: new Date(2025, 7, 15),   // 2025년 8월 15일
      duration: 12,
      progress: 50,
      parent: 3,
      type: "task",
    },
    {
      id: 8,
      text: "통합 테스트",
      start: new Date(2025, 7, 18), // 2025년 8월 18일
      end: new Date(2025, 7, 29),   // 2025년 8월 29일
      duration: 12,
      progress: 30,
      parent: 3,
      type: "task",
    },
    {
      id: 9,
      text: "배포 및 론칭",
      start: new Date(2025, 8, 1),  // 2025년 9월 1일
      end: new Date(2025, 8, 15),   // 2025년 9월 15일
      duration: 14,
      progress: 10,
      parent: 3,
      type: "task",
    },
  ];

  const links = [
    { id: 1, source: 1, target: 2, type: "e2s" },
    { id: 2, source: 2, target: 4, type: "e2s" },  
    { id: 3, source: 4, target: 5, type: "e2s" },  
    { id: 4, source: 5, target: 6, type: "e2s" },  
    { id: 5, source: 6, target: 7, type: "e2s" },   
    { id: 6, source: 7, target: 8, type: "e2s" },   
    { id: 7, source: 8, target: 9, type: "e2s" },   
  ];

  const scales = [
    { unit: "month", step: 1, format: "MMMM yyyy" },
    { unit: "day", step: 1, format: "d" },
  ];

  const columns = [
    { id: "text", header: "작업명", flexGrow: 1,align: "center"},
    { id: "start", header: "시작일", flexGrow: 1, align: "center" },
    // { id: "duration", header: "기간", align: "center", flexGrow: 1 },
    { id: "action", header: "", width: 50, align: "center" },
  ];

  const editorShape = [
    {
      key: "text",
      type: "text",
      label: "작업명",
      config: {
        placeholder: "작업명을 입력하세요",
        focus: true
      }
    },
    {
      key: "details",
      type: "textarea",
      label: "상세 설명",
      config: {
        placeholder: "작업에 대한 자세한 설명을 입력하세요"
      }
    },
    {
      key: "type",
      type: "select",
      label: "작업 유형",
      options: [
        { id: "task", label: "일반 작업" },
        { id: "summary", label: "요약 작업" },
        { id: "milestone", label: "마일스톤" }
      ]
    },
    {
      key: "start",
      type: "date",
      label: "시작일"
    },
    {
      key: "end",
      type: "date", 
      label: "종료일"
    },
    // {
    //   key: "duration",
    //   type: "counter",
    //   label: "기간 (일)",
    //   config: {
    //     min: 1,
    //     max: 365
    //   }
    // },
    {
      key: "progress",
      type: "slider",
      label: "진행률 (%)",
      config: {
        min: 0,
        max: 100,
        step: 1
      }
    },
    {
      key: "priority",
      type: "select",
      label: "우선순위",
      options: [
        { id: "low", label: "낮음" },
        { id: "medium", label: "보통" },
        { id: "high", label: "높음" },
        { id: "critical", label: "긴급" }
      ]
    },
    {
      key: "assignee",
      type: "select",
      label: "담당자",
      options: [
        { id: "kim", label: "김개발" },
        { id: "park", label: "박디자인" },
        { id: "lee", label: "이기획" },
        { id: "choi", label: "최테스터" }
      ]
    },
    {
      key: "links",
      type: "links",
      label: "연결 관계"
    }
  ];

  return (
    <div className="py-2">
      <div className="border border-gray-200 rounded-lg overflow-hidden" style={{height: '600px' }}>
        <Willow>
          <Gantt 
            ref={apiRef}
            tasks={tasks} 
            links={links} 
            scales={scales}
            columns={columns}
            editorShape={editorShape}
          />
        </Willow>
      </div>
    </div>
  );
};

export default GanttChart;

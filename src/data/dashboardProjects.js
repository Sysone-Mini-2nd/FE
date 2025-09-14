// 더미 데이터 - API 연동 전까지 사용
export const dummyProjectData = {
  statusCode: 200,
  message: "프로젝트 리스트 호출 성공",
  data: {
    projectCount: 3,
    issueCount: 8,
    projects: [
      {
        id: 1,
        name: "채팅 애플리케이션 개발",
        participant: ["김개발", "이디자인", "박기획"],
        progressRate: 75.5,
        totalTasks: 24,
        endDate: "2025-09-25T23:59:59.000+00:00"
      },
      {
        id: 2,
        name: "웹 어플리케이션 리뉴얼",
        participant: ["최프론트", "한백엔드"],
        progressRate: 45.2,
        totalTasks: 18,
        endDate: "2025-10-15T23:59:59.000+00:00"
      },
      {
        id: 3,
        name: "모바일 앱 개발",
        participant: ["송모바일", "윤테스트", "정데브옵스"],
        progressRate: 30.8,
        totalTasks: 32,
        endDate: "2025-11-30T23:59:59.000+00:00"
      },
      {
        id: 4,
        name: "AI 챗봇 시스템",
        participant: ["이AI", "박머신러닝"],
        progressRate: 60.3,
        totalTasks: 15,
        endDate: "2025-10-30T23:59:59.000+00:00"
      }
    ]
  }
};

// API 호출 함수 (현재는 더미 데이터 반환)
export const fetchDashboardProjects = async () => {
  try {
    // TODO: 실제 API 엔드포인트로 변경
    // const response = await fetch('{{domain}}/api/dashboards');
    // if (!response.ok) {
    //   throw new Error('API 호출 실패');
    // }
    // return await response.json();
    
    // 현재는 더미 데이터 반환 (네트워크 지연 시뮬레이션)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(dummyProjectData);
      }, 500);
    });
  } catch (error) {
    console.error('프로젝트 데이터 로딩 실패:', error);
    throw error;
  }
};
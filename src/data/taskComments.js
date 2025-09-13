// 작업 댓글 더미 데이터
export const taskCommentsData = [
  {
    id: 1,
    taskId: '4-1', // 작업 ID와 연결
    authorId: 1,
    authorName: '박서호',
    authorPosition: '사원',
    content: '새로운 대시보드 UI 디자인 검토했습니다. 전반적으로 깔끔하고 사용자 친화적인 것 같습니다.',
    createdAt: '2024-03-15T09:30:00',
    updatedAt: '2024-03-15T09:30:00',
    isEdited: false
  },
  {
    id: 2,
    taskId: '4-1',
    authorId: 2,
    authorName: '이지민',
    authorPosition: '대리',
    content: '컬러 팔레트 부분에서 접근성을 고려한 색상 대비 검토가 필요할 것 같습니다. WCAG 가이드라인을 참고해주세요.',
    createdAt: '2024-03-15T10:15:00',
    updatedAt: '2024-03-15T10:20:00',
    isEdited: true
  },
  {
    id: 3,
    taskId: '4-1',
    authorId: 3,
    authorName: '최우식',
    authorPosition: '주임',
    content: '좋은 지적입니다. 다음 주 회의에서 접근성 가이드라인에 대해 논의해보겠습니다.',
    createdAt: '2024-03-15T11:00:00',
    updatedAt: '2024-03-15T11:00:00',
    isEdited: false
  },
  {
    id: 4,
    taskId: '4-1',
    authorId: 4,
    authorName: '이수민',
    authorPosition: '사원',
    content: '대시보드의 반응형 디자인도 확인이 필요합니다. 모바일에서의 표시 방식은 어떻게 계획하고 계신가요?',
    createdAt: '2024-03-15T14:30:00',
    updatedAt: '2024-03-15T14:30:00',
    isEdited: false
  },
  {
    id: 5,
    taskId: '4-1',
    authorId: 1,
    authorName: '박서호',
    authorPosition: '사원',
    content: '모바일 버전은 별도로 디자인하고 있습니다. 이번 주 내로 프로토타입을 공유드리겠습니다.',
    createdAt: '2024-03-15T15:45:00',
    updatedAt: '2024-03-15T15:45:00',
    isEdited: false
  }
];

// 작업 ID별 댓글 필터링 함수
export const getCommentsByTaskId = (taskId) => {
  return taskCommentsData.filter(comment => comment.taskId === taskId);
};

// 새 댓글 추가 함수 (실제 구현시 API 호출로 대체)
export const addComment = (taskId, authorId, authorName, authorPosition, content) => {
  const newComment = {
    id: taskCommentsData.length + 1,
    taskId,
    authorId,
    authorName,
    authorPosition,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isEdited: false
  };
  
  taskCommentsData.push(newComment);
  return newComment;
};

// 댓글 수정 함수
export const updateComment = (commentId, newContent) => {
  const commentIndex = taskCommentsData.findIndex(comment => comment.id === commentId);
  if (commentIndex !== -1) {
    taskCommentsData[commentIndex] = {
      ...taskCommentsData[commentIndex],
      content: newContent,
      updatedAt: new Date().toISOString(),
      isEdited: true
    };
    return taskCommentsData[commentIndex];
  }
  return null;
};

// 댓글 삭제 함수
export const deleteComment = (commentId) => {
  const commentIndex = taskCommentsData.findIndex(comment => comment.id === commentId);
  if (commentIndex !== -1) {
    return taskCommentsData.splice(commentIndex, 1)[0];
  }
  return null;
};
import React, { useState, useMemo } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import KanbanHeader from './KanbanHeader';
import KanbanColumn from './KanbanColumn';
import TaskDetail from '../common/task/TaskDetail';
import { useProjectIssues, useCreateIssue, useUpdateIssue, useDeleteIssue } from '../../hooks/useIssueQueries';

const columnMap = {
  TODO: '할 일',
  IN_PROGRESS: '진행 중',
  DONE: '완료',
};

const columnOrder = ['TODO', 'IN_PROGRESS', 'DONE'];

function Kanban({ projectId, members = [] }, isPm) {
  const { data: issues, isLoading, isError } = useProjectIssues(projectId);
  const createIssueMutation = useCreateIssue();
  const updateIssueMutation = useUpdateIssue();
  const deleteIssueMutation = useDeleteIssue();

  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);

  const columns = useMemo(() => {
    const newColumns = {
      TODO: { id: 'TODO', title: '할 일', items: [] },
      IN_PROGRESS: { id: 'IN_PROGRESS', title: '진행 중', items: [] },
      DONE: { id: 'DONE', title: '완료', items: [] },
    };

    if (issues) {
      issues.forEach(issue => {
        if (newColumns[issue.status]) {
          newColumns[issue.status].items.push(issue);
        }
      });
    }
    return newColumns;
  }, [issues]);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const issueId = parseInt(draggableId, 10);
    const newStatus = destination.droppableId;

    updateIssueMutation.mutate({
      issueId,
      issueData: { status: newStatus },
      isPatch: true,
      projectId: projectId, 
    });
  };

  const handleAddNewCard = (columnId) => {
    // 새 이슈에 대한 기본 날짜 정보를 추가합니다.
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 1); // 기본 마감일은 다음 날로 설정

    const newIssueData = {
      title: "새로운 작업",
      desc: "",
      priority: "NORMAL",
      status: columnId,
      // 서버에서 필수일 수 있는 날짜 정보를 추가합니다.
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    createIssueMutation.mutate({ 
      projectId, 
      issueData: newIssueData 
    });
  };

  const handleDeleteCard = (issueId) => {
    if (window.confirm('정말로 이 작업을 삭제하시겠습니까?')) {
      deleteIssueMutation.mutate({ projectId, issueId });
    }
  };

  const handleCardClick = (task) => {
    setSelectedTask(task);
    setShowTaskDetail(true);
  };

  const handleBackToKanban = () => {
    setShowTaskDetail(false);
    setSelectedTask(null);
  };

  if (isLoading) return <div>칸반 보드 로딩 중...</div>;
  if (isError) return <div>데이터를 불러오는 중 에러가 발생했습니다.</div>;

  return (
    <div>
      {showTaskDetail ? (
        <TaskDetail 
          task={selectedTask} 
          onBack={handleBackToKanban} 
          members={members}
        />
      ) : (
        <>
          <KanbanHeader />
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-6 py-4 min-w-max">
              {columnOrder.map(columnId => {
                const column = columns[columnId];
                if (!column) return null;
                return (
                  <div key={column.id} className="w-80 flex-shrink-0">
                    <KanbanColumn
                      column={column}
                      onAddCard={() => handleAddNewCard(column.id)}
                      onDeleteCard={handleDeleteCard}
                      onCardClick={handleCardClick}
                      isPm={isPm}
                    />
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        </>
      )}
    </div>
  );
}

export default Kanban;

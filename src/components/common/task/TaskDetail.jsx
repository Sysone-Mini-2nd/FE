import React, { useState, useEffect } from 'react';
import { useIssueDetail, useUpdateIssue, useDeleteIssue } from '../../../hooks/useIssueQueries';

import TaskHeader from './TaskHeader';
import TaskActions from './TaskActions';
import TaskDescription from './TaskDescription';
import TaskMetadata from './TaskMetadata';
import TaskSchedule from './TaskSchedule';
import TaskComments from './TaskComments';

// 상수 분리
const PRIORITY_MAPPING = {
  low: 'LOW',
  medium: 'NORMAL',
  high: 'HIGH',
  warning: 'WARNING'
};

const STATUS_MAPPING = {
  todo: 'TODO',
  progress: 'IN_PROGRESS',
  done: 'DONE',
  review: 'REVIEW'
};

function TaskDetail({ task: initialTask, onBack, members }) {
  const { data: task, isLoading, isError } = useIssueDetail(initialTask?.id);
  const updateIssueMutation = useUpdateIssue();
  const deleteIssueMutation = useDeleteIssue();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    if (task) {
      setEditData(task);
    }
  }, [task]);

  // 데이터 변환 유틸리티 함수
  const transformDataForAPI = (data) => {
    const priorityKey = (data.priority || '').toLowerCase();
    const statusKey = (data.status || '').toLowerCase().replace('_', '');

    return {
      ...data,
      priority: PRIORITY_MAPPING[priorityKey] || data.priority,
      status: STATUS_MAPPING[statusKey] || data.status,
    };
  };

  // 액션 핸들러들을 객체로 그룹화
  const actions = {
    edit: () => {
      setIsEditing(true);
      setEditData(task);
    },

    cancel: () => {
      setIsEditing(false);
      setEditData(task);
    },

    save: () => {
      const transformedData = transformDataForAPI(editData);

      updateIssueMutation.mutate(
        {
          issueId: task.id,
          issueData: transformedData,
          isPatch: false,
          projectId: task.projectId,
        },
        {
          onSuccess: () => {
            setIsEditing(false);
          },
        }
      );
    },

    delete: () => {
      const confirmed = window.confirm('정말로 이 작업을 삭제하시겠습니까?');

      if (confirmed) {
        deleteIssueMutation.mutate(
          {
            issueId: task.id,
            projectId: task.projectId,
          },
          {
            onSuccess: () => {
              onBack();
            },
          }
        );
      }
    }
  };

  // 로딩 및 에러 상태 처리
  if (isLoading) {
    return (
      <div className="p-6 text-center">
        작업 상세 정보를 불러오는 중...
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="p-6 text-center text-red-500">
        작업 정보를 불러오는 데 실패했습니다.
      </div>
    );
  }

  return (
    <div className="min-h-full p-4">
      <div className="mx-auto">
        <TaskHeader
          task={task}
          isEditing={isEditing}
          editData={editData}
          setEditData={setEditData}
          onBack={onBack}
          members={members}
        >
          <TaskActions
            isEditing={isEditing}
            onEdit={actions.edit}
            onDelete={actions.delete}
            onSave={actions.save}
            onCancel={actions.cancel}
            isLoading={updateIssueMutation.isLoading || deleteIssueMutation.isLoading}
          />
        </TaskHeader>

        <div className="grid grid-cols-5 gap-6 mt-4">
          <div className="col-span-3 space-y-6">
            <TaskDescription
              task={task}
              isEditing={isEditing}
              editData={editData}
              setEditData={setEditData}
            />
            <TaskMetadata task={task} />
            <TaskSchedule
              task={task}
              isEditing={isEditing}
              editData={editData}
              setEditData={setEditData}
            />
          </div>

          <div className="col-span-2">
            <TaskComments task={task} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;
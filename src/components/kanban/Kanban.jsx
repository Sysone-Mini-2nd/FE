import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import KanbanColumn from './KanbanColumn'
import KanbanCard from './KanbanCard'
import KanbanHeader from './KanbanHeader'
import { Add } from '@mui/icons-material'

function Kanban({ projectId }) {
  // projectId에 따른 태스크 데이터 
  const getProjectTasks = (projectId) => {
    // 샘플 데이터 - 실제로는 projectId로 API 호출
    return {
      'todo': {
        id: 'todo',
        title: '할 일',
        color: 'bg-gray-100',
        items: [
          {
            id: `${projectId}-1`,
            title: 'UI 디자인 검토',
            description: '새로운 대시보드 UI 디자인 검토 및 피드백',
            assignee: '김디자인',
            priority: 'medium',
            tags: ['디자인', 'UI'],
            dueDate: '2024-03-15'
          },
          {
            id: `${projectId}-2`,
            title: '데이터베이스 스키마 설계',
            description: '사용자 관리 시스템을 위한 DB 스키마 설계',
            assignee: '박개발',
            priority: 'high',
            tags: ['백엔드', 'DB'],
            dueDate: '2024-03-20'
          }
        ]
      },
      'progress': {
        id: 'progress',
        title: '진행 중',
        color: 'bg-blue-100',
        items: [
          {
            id: `${projectId}-3`,
            title: 'API 개발',
            description: '사용자 인증 API 개발 진행 중',
            assignee: '이백엔드',
            priority: 'high',
            tags: ['API', '백엔드'],
            dueDate: '2024-03-18'
          },
          {
            id: `${projectId}-4`,
            title: '컴포넌트 개발',
            description: '재사용 가능한 UI 컴포넌트 개발',
            assignee: '최프론트',
            priority: 'medium',
            tags: ['프론트엔드', '컴포넌트'],
            dueDate: '2024-03-25'
          }
        ]
      },
      'review': {
        id: 'review',
        title: '검토',
        color: 'bg-yellow-100',
        items: [
          {
            id: `${projectId}-5`,
            title: '코드 리뷰',
            description: '프론트엔드 코드 리뷰 및 개선사항 확인',
            assignee: '김시니어',
            priority: 'medium',
            tags: ['코드리뷰'],
            dueDate: '2024-03-22'
          }
        ]
      },
      'done': {
        id: 'done',
        title: '완료',
        color: 'bg-green-100',
        items: [
          {
            id: `${projectId}-6`,
            title: '프로젝트 초기 설정',
            description: '프로젝트 구조 및 개발 환경 설정 완료',
            assignee: '박팀장',
            priority: 'high',
            tags: ['설정', '환경구축'],
            dueDate: '2024-03-10'
          }
        ]
      }
    }
  }

  const [columns, setColumns] = useState(getProjectTasks(projectId))

  const handleDragEnd = (result) => {
    const { destination, source} = result //draggableId 

    // 드롭 위치가 없으면 리턴
    if (!destination) {
      return
    }

    // 같은 위치로 드롭하면 리턴
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const sourceColumn = columns[source.droppableId]
    const destColumn = columns[destination.droppableId]

    // 같은 컬럼 내에서 이동
    if (sourceColumn === destColumn) {
      const newItems = Array.from(sourceColumn.items)
      const [removed] = newItems.splice(source.index, 1)
      newItems.splice(destination.index, 0, removed)

      const newColumn = {
        ...sourceColumn,
        items: newItems
      }

      setColumns({
        ...columns,
        [newColumn.id]: newColumn
      })
      return
    }

    // 다른 컬럼으로 이동
    const sourceItems = Array.from(sourceColumn.items)
    const destItems = Array.from(destColumn.items)
    const [removed] = sourceItems.splice(source.index, 1)
    destItems.splice(destination.index, 0, removed)

    const newSourceColumn = {
      ...sourceColumn,
      items: sourceItems
    }

    const newDestColumn = {
      ...destColumn,
      items: destItems
    }

    setColumns({
      ...columns,
      [newSourceColumn.id]: newSourceColumn,
      [newDestColumn.id]: newDestColumn
    })
  }

  const addNewCard = (columnId) => {
    const newCard = {
      id: `${projectId}-${Date.now()}`,
      title: '새 작업',
      description: '작업 설명을 입력하세요',
      assignee: '담당자',
      priority: 'medium',
      tags: [],
      dueDate: new Date().toISOString().split('T')[0]
    }

    setColumns({
      ...columns,
      [columnId]: {
        ...columns[columnId],
        items: [...columns[columnId].items, newCard]
      }
    })
  }

  const updateCard = (cardId, updatedCard) => {
    const newColumns = { ...columns }
    
    Object.keys(newColumns).forEach(columnId => {
      const cardIndex = newColumns[columnId].items.findIndex(item => item.id === cardId)
      if (cardIndex !== -1) {
        newColumns[columnId].items[cardIndex] = updatedCard
      }
    })
    
    setColumns(newColumns)
  }

  const deleteCard = (cardId) => {
    const newColumns = { ...columns }
    
    Object.keys(newColumns).forEach(columnId => {
      newColumns[columnId].items = newColumns[columnId].items.filter(item => item.id !== cardId)
    })
    
    setColumns(newColumns)
  }

  return (
    <div className="h-full flex flex-col">
      <KanbanHeader />
      
      <div className="flex-1 overflow-x-auto">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 p-6 min-w-max">
            {Object.values(columns).map(column => (
              <div key={column.id} className="w-80 flex-shrink-0">
                <KanbanColumn
                  column={column}
                  onAddCard={() => addNewCard(column.id)}
                  onUpdateCard={updateCard}
                  onDeleteCard={deleteCard}
                />
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}

export default Kanban

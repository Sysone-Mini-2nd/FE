import React, { useState, useEffect, useCallback } from 'react'
import Calendar from '../components/calendar/Calendar'
import CalendarFilters from '../components/calendar/CalendarFilters'
import EventDetails from '../components/calendar/EventDetails'
import dayjs from 'dayjs'

function ShareCalendar() {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [filters, setFilters] = useState({})
  const [sortBy, setSortBy] = useState('createdAt')

  useEffect(() => {
    // 샘플 이벤트 데이터
    const sampleEvents = [
      {
        id: 1,
        title: '월정 제출',
        description: '참가자들에게 제출 알림',
        start: new Date(2025, 8, 3, 10, 0), // 9월 3일
        end: new Date(2025, 8, 3, 11, 0),
        type: 'submission',
        assignee: '김개발',
        priority: 'high',
        status: 'pending',
        actions: [
          { type: 'confirm', label: '확인' },
          { type: 'edit', label: '수정' }
        ]
      },
      {
        id: 2,
        title: '회의록 제출',
        description: '주제: 주택마실',
        start: new Date(2025, 8, 3, 14, 0),
        end: new Date(2025, 8, 3, 15, 0),
        type: 'meeting',
        assignee: '이디자인',
        priority: 'medium',
        status: 'in-progress',
        actions: [
          { type: 'cancel', label: '다시알림' },
          { type: 'confirm', label: 'UI' }
        ]
      },
      {
        id: 3,
        title: '회의록 바로가기',
        start: new Date(2025, 8, 3, 16, 0),
        end: new Date(2025, 8, 5, 17, 0),
        type: 'review',
        assignee: '박기획',
        priority: 'low',
        status: 'completed'
      },
      {
        id: 4,
        title: '작업 제출',
        description: '소식 프로젝트 - 프로젝트 설정',
        start: new Date(2025, 8, 13, 9, 0),
        end: new Date(2025, 8, 13, 18, 0),
        type: 'task',
        assignee: '님엔진',
        priority: 'high',
        status: 'pending',
        actions: [
          { type: 'cancel', label: '다시알림' },
          { type: 'confirm', label: 'UI' }
        ]
      },
      {
        id: 5,
        title: '팀 미팅',
        description: '주간 스프린트 리뷰',
        start: new Date(2025, 8, 10, 10, 0),
        end: new Date(2025, 8, 10, 11, 30),
        type: 'meeting',
        assignee: '전체',
        priority: 'medium',
        status: 'pending'
      }
    ]
    
    setEvents(sampleEvents)
    setFilteredEvents(sampleEvents)
  }, [])

  // 필터링 로직
  useEffect(() => {
    let filtered = [...events]

    // 상태 필터
    if (filters.status) {
      filtered = filtered.filter(event => event.status === filters.status)
    }

    // 우선순위 필터
    if (filters.priority) {
      filtered = filtered.filter(event => event.priority === filters.priority)
    }

    // 담당자 필터
    if (filters.assignee) {
      filtered = filtered.filter(event => event.assignee === filters.assignee)
    }

    // 기간 필터
    if (filters.period) {
      const now = dayjs()
      switch (filters.period) {
        case 'today':
          filtered = filtered.filter(event => 
            dayjs(event.start).isSame(now, 'day')
          )
          break
        case 'week':
          filtered = filtered.filter(event => 
            dayjs(event.start).isSame(now, 'week')
          )
          break
        case 'month':
          filtered = filtered.filter(event => 
            dayjs(event.start).isSame(now, 'month')
          )
          break
        default:
          break
      }
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return dayjs(a.end).isAfter(dayjs(b.end)) ? 1 : -1
        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        }
        case 'title':
          return a.title.localeCompare(b.title)
        default: // createdAt
          return dayjs(b.start).isAfter(dayjs(a.start)) ? 1 : -1
      }
    })

    setFilteredEvents(filtered)
  }, [events, filters, sortBy])

  // 선택된 날짜의 이벤트 가져오기
  const getSelectedDateEvents = useCallback(() => {
    if (!selectedDate) return []
    
    return filteredEvents.filter(event => 
      dayjs(event.start).isSame(dayjs(selectedDate), 'day')
    )
  }, [selectedDate, filteredEvents])

  // 이벤트 핸들러들
  const handleSelectEvent = useCallback((event) => {
    setSelectedDate(event.start)
  }, [])

  const handleSelectSlot = useCallback((slotInfo) => {
    setSelectedDate(slotInfo.start)
  }, [])

  const handleFilterChange = useCallback((filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value || undefined
    }))
  }, [])

  const handleSortChange = useCallback((value) => {
    setSortBy(value)
  }, [])

  const handleEventAction = useCallback((eventId, action) => {
    console.log(`Event ${eventId} action: ${action}`)
    // 여기에 실제 액션 로직 구현
    // 예: API 호출, 상태 업데이트 등
  }, [])

  return (
    <div className="bg-gray-50 min-h-full">
      {/* <div className="mb-6 md:mb-8 text-start">
        <h1 className="text-lg md:text-3xl font-bold text-gray-900 mb-2">공유 캘린더</h1>
      </div> */}

      <CalendarFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-4 md:gap-6">
        <div className="rounded-xl overflow-hidden">
          <Calendar
            events={filteredEvents}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
          />
        </div>
        
        <div className="rounded-xl">
          <EventDetails
            selectedDate={selectedDate}
            events={getSelectedDateEvents()}
            onEventAction={handleEventAction}
          />
        </div>
      </div>
    </div>
  )
}

export default ShareCalendar
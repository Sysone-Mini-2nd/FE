import React, { useState, useCallback } from 'react'
import { Calendar as BigCalendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = dayjsLocalizer(dayjs)

const Calendar = ({ events, onSelectEvent, onSelectSlot }) => {
  const [view, setView] = useState('month')
  const [date, setDate] = useState(new Date())

  const handleSelectEvent = useCallback((event) => {
    onSelectEvent && onSelectEvent(event)
  }, [onSelectEvent])

  const handleSelectSlot = useCallback((slotInfo) => {
    onSelectSlot && onSelectSlot(slotInfo)
  }, [onSelectSlot])

  const handleNavigate = useCallback((newDate) => {
    setDate(newDate)
  }, [])

  const handleViewChange = useCallback((newView) => {
    setView(newView)
  }, [])

  // 이벤트 스타일 커스터마이징
  const eventStyleGetter = useCallback((event) => {
    let backgroundColor = '#3174ad'
    
    // 팀원별 색상 구분
    switch (event.type) {
      case 'submission':
        backgroundColor = '#ff9f9f'
        break
      case 'meeting':
        backgroundColor = '#9f9fff'
        break
      case 'task':
        backgroundColor = '#ffdf9f'
        break
      case 'review':
        backgroundColor = '#9fffdf'
        break
      default:
        backgroundColor = '#3174ad'
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    }
  }, [])

  // 커스텀 메시지 (한국어)
  const messages = {
    allDay: '종일',
    previous: '‹',
    next: '›',
    today: '오늘',
    month: '월',
    week: '주',
    day: '일',
    agenda: '일정',
    date: '날짜',
    time: '시간',
    event: '이벤트',
    noEventsInRange: '해당 기간에 일정이 없습니다.',
    showMore: (total) => `+${total} 더보기`
  }

  return (
    <div className="bg-white rounded-lg p-3 shadow-lg">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        onNavigate={handleNavigate}
        onView={handleViewChange}
        view={view}
        date={date}
        selectable
        popup
        eventPropGetter={eventStyleGetter}
        messages={messages}
        style={{ height: 600 }}
        views={['month', 'week', 'day', 'agenda']}
        step={30}
        showMultiDayTimes
        defaultDate={new Date()}
      />
    </div>
  )
}

export default Calendar

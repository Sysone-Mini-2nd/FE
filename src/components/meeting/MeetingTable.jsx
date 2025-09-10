import { createColumnHelper } from '@tanstack/react-table'
import { 
  CalendarToday,
  People,
  Folder
} from '@mui/icons-material'
import DataTable from '../common/DataTable'

const columnHelper = createColumnHelper()

function MeetingTable({ meetings = [], onAction }) {
  const getTypeBadge = (type) => {
    const typeConfig = {
      'Daily Scrum': { label: 'Daily Scrum', className: ' text-purple-800' },
      'Sprint Meeting': { label: 'Sprint Meeting', className: 'text-indigo-800' },
      'Sprint Review': { label: 'Sprint Review', className: 'text-green-800 ' },
      'Sprint Retrospective': { label: 'Sprint Retro', className: 'text-orange-800 ' },
      '기타': { label: '기타', className: 'text-gray-800 ' }
    }
    const config = typeConfig[type] || typeConfig['기타']
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${config.className}`}>
        {config.label}
      </span>
    )
  }

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr)
    const dateStr = date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    const timeStr = date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    })
    return { dateStr, timeStr }
  }

  const columns = [
    columnHelper.accessor('title', {
      header: '제목',
      cell: info => (
        <div className="flex items-center gap-3">
          <Folder className="w-4 h-4 text-gray-400" />
          <div>
            <div 
              className="font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => onAction('view', info.row.original)}
            >
              {info.getValue()}
            </div>
            <div className="text-sm text-gray-500 max-w-xs truncate">
              {info.row.original.description || '설명 없음'}
            </div>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('organizer', {
      header: '작성자',
      cell: info => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
            {info.getValue()?.slice(0, 1) || '?'}
          </div>
          <span className="text-sm font-medium">{info.getValue() || '미정'}</span>
        </div>
      ),
    }),
    columnHelper.accessor('type', {
      header: '타입',
      cell: info => getTypeBadge(info.getValue()),
    }),
    columnHelper.accessor('scheduledDate', {
      header: '진행 날짜',
      cell: info => {
        const { dateStr, timeStr } = formatDateTime(info.getValue())
        return (
          <div className="flex items-center gap-2">
            <CalendarToday className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-sm font-medium">{dateStr}</div>
              <div className="text-xs text-gray-500">{timeStr}</div>
            </div>
          </div>
        )
      },
    }),
    columnHelper.accessor('status', {
      header: '장소',
      cell: info => (
        <span className="text-sm text-gray-700">
          {info.row.original.location || '미정'}
        </span>
      ),
    }),
    columnHelper.accessor('participants', {
      header: '참여 인원',
      cell: info => {
        const participants = info.getValue() || []
        return (
          <div className="flex items-center gap-2">
            <People className="w-4 h-4 text-gray-400" />
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{participants.length}명</span>
              <div className="flex -space-x-1">
                {participants.slice(0, 3).map((participant, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 border border-white"
                    title={participant}
                  >
                    {participant.slice(0, 1)}
                  </div>
                ))}
                {participants.length > 3 && (
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600 border border-white">
                    +{participants.length - 3}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      },
    })
  ]
  return (
    <DataTable 
      data={meetings}
      columns={columns}
      onRowClick={(meeting) => onAction('view', meeting)}
      emptyMessage="회의록이 없습니다."
    />
  )
}

export default MeetingTable

import { createColumnHelper } from '@tanstack/react-table'
import { 
  CalendarToday,
  People,
  Folder
} from '@mui/icons-material'
import DataTable from '../common/DataTable'

const columnHelper = createColumnHelper()

function MeetingTable({ meetings = [], onAction, loading = false }) {
  const getTypeBadge = (type) => {
    const typeConfig = {
      'SCRUM': { label: 'Daily Scrum', className: ' text-purple-800' },
      'MEETING': { label: 'MEETING', className: 'text-indigo-800' },
      'REVIEW': { label: 'Sprint Review', className: 'text-green-800 ' },
      'RETROSPECTIVE': { label: 'Sprint Retro', className: 'text-orange-800 ' },
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
        // 서버에서 participantCount를 제공하므로 이를 사용
        const participantCount = info.row.original.participantCount || 0
        return (
          <div className="flex items-center gap-2">
            <People className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium">{participantCount}명</span>
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
      loading={loading}
      skeletonRows={10}
    />
  )
}

export default MeetingTable

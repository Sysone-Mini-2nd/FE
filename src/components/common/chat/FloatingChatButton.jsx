import { Telegram } from '@mui/icons-material'

const FloatingChatButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="chatbutton"
    >
      <Telegram className="w-6 h-6" />
    </button>
  )
}

export default FloatingChatButton

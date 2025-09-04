import Header from './Header';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import FloatingChat from '../common/chat/FloatingChat';

function Layout({ children }) {
  return (
      <div className="h-screen w-full flex overflow-hidden">
        {/* 사이드바 */}
        <Sidebar />
        
        {/* 상단바 + 메인콘텐츠 */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* 상단바 */}
          <Header />
          
          {/* 메인 콘텐츠 */}
          <MainContent>
            {children}
          </MainContent>
        </div>
        
        {/* 플로팅 채팅 */}
        <FloatingChat />
      </div>
  );
}

export default Layout;

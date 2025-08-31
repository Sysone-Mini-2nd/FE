import Header from './Header';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

function Layout({ children }) {
  return (
      <div className="h-screen w-full flex overflow-hidden">
        {/* 좌측 사이드바 영역 - 고정 */}
        <Sidebar />
        
        {/* 우측 영역: 상단바 + 메인콘텐츠 */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* 상단바 - 고정 */}
          <Header />
          
          {/* 메인 콘텐츠 - 스크롤 가능 */}
          <MainContent>
            {children}
          </MainContent>
        </div>
      </div>
  );
}

export default Layout;

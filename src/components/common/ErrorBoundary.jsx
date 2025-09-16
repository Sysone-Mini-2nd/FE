import React from 'react';
import { AlertTriangle, RefreshCw } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트 합니다.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 에러 리포팅 서비스에 에러를 기록할 수도 있습니다
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // 커스텀 에러 UI를 렌더링할 수 있습니다
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            {this.props.title || '오류가 발생했습니다'}
          </h2>
          <p className="text-red-600 text-center mb-4">
            {this.props.message || '컴포넌트를 로드하는 중 문제가 발생했습니다.'}
          </p>
          
          {import.meta.env.DEV && this.state.error && (
            <details className="w-full mb-4">
              <summary className="cursor-pointer text-sm text-red-500 hover:text-red-700">
                상세 오류 정보 (개발 모드)
              </summary>
              <div className="mt-2 p-3 bg-red-100 rounded text-sm text-red-800 overflow-auto max-h-32">
                <div className="font-semibold">Error:</div>
                <div className="mb-2">{this.state.error.toString()}</div>
                <div className="font-semibold">Stack Trace:</div>
                <pre className="whitespace-pre-wrap text-xs">
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            </details>
          )}
          
          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            다시 시도
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
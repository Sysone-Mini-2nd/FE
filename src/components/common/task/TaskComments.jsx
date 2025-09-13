import React, { useState, useEffect } from 'react';
import { getCommentsByTaskId, addComment, updateComment, deleteComment } from '../../../data/taskComments';
import { membersData } from '../../../data/employees';

function TaskComments({ taskId = '4-1' }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 현재 사용자 정보 (실제 구현시 AuthContext에서 가져옴)
  const currentUser = membersData[0]; // 첫 번째 사용자를 현재 사용자로 가정

  useEffect(() => {
    // 댓글 목록 로드
    const taskComments = getCommentsByTaskId(taskId);
    setComments(taskComments);
  }, [taskId]);

  // 새 댓글 작성
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const comment = addComment(
        taskId,
        currentUser.id,
        currentUser.name,
        currentUser.position,
        newComment.trim()
      );
      
      setComments(prev => [...prev, comment]);
      setNewComment('');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 댓글 수정 시작
  const handleStartEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  // 댓글 수정 취소
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  // 댓글 수정 저장
  const handleSaveEdit = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      const updatedComment = updateComment(commentId, editContent.trim());
      if (updatedComment) {
        setComments(prev => 
          prev.map(comment => 
            comment.id === commentId ? updatedComment : comment
          )
        );
        setEditingCommentId(null);
        setEditContent('');
      }
    } catch (error) {
      console.error('댓글 수정 실패:', error);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      const deletedComment = deleteComment(commentId);
      if (deletedComment) {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
      }
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
    }
  };

  // 시간 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return '방금 전';
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <div className="col-span-2">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          댓글 ({comments.length})
        </h3>
        
        {/* 댓글 목록 */}
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {comments.length === 0 ? (
            <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
              <p className="text-gray-500">첫 번째 댓글을 작성하세요</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {comment.authorName[0]}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">
                        {comment.authorName}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        {comment.authorPosition}
                      </span>
                    </div>
                  </div>
                  
                  {comment.authorId === currentUser.id && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStartEdit(comment)}
                        className="text-sm text-gray-500 hover:text-gray-800"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-sm text-gray-500 hover:text-red-600"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
                
                {editingCommentId === comment.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-2 border border-gray-300 selected-none rounded-md resize-none "
                      rows="3"
                      placeholder="댓글을 입력하세요..."
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveEdit(comment.id)}
                        className="createBtn"
                      >
                        저장
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="cancelBtn"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-800 mb-2 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{formatDate(comment.createdAt)}</span>
                      {comment.isEdited && (
                        <span className="text-gray-400">(수정됨)</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* 새 댓글 작성 폼 */}
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <div className="flex items-start space-x-3 select-none">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">
                {currentUser.name[0]}
              </span>
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-white p-3 border border-gray-300 rounded-md resize-none focus:outline-none"
                rows="3"
                placeholder="댓글을 입력하세요..."
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="createBtn"
            >
              {isSubmitting ? '작성 중...' : '댓글 작성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskComments;
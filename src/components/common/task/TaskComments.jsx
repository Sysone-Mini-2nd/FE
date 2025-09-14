import React, { useState, useContext } from 'react';
import { useGetComments, useCreateComment, useUpdateComment, useDeleteComment } from '../../../hooks/useCommentQueries';
import AuthContext from '../../../contexts/AuthContext';

// 댓글 하나를 렌더링하는 재사용 가능한 컴포넌트
const Comment = ({ comment, onStartEdit, onSaveEdit, onCancelEdit, onDelete, onStartReply, editingCommentId, editContent, setEditContent, currentUser }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-medium">{comment.memberName[0]}</span>
          </div>
          <div>
            <span className="font-medium text-gray-900">{comment.memberName}</span>
            <span className="text-sm text-gray-500 ml-2">{comment.memberPosition}</span>
          </div>
        </div>
        {currentUser && comment.memberId === currentUser.id && editingCommentId !== comment.id && (
          <div className="flex space-x-2">
            <button onClick={() => onStartEdit(comment)} className="text-sm text-gray-500 hover:text-gray-800">수정</button>
            <button onClick={() => onDelete(comment.id)} className="text-sm text-gray-500 hover:text-red-600">삭제</button>
          </div>
        )}
      </div>

      {editingCommentId === comment.id ? (
        <div className="space-y-2">
          <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md resize-none" rows="3" />
          <div className="flex space-x-2">
            <button onClick={() => onSaveEdit(comment.id)} className="createBtn">저장</button>
            <button onClick={onCancelEdit} className="cancelBtn">취소</button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-gray-800 mb-2 whitespace-pre-wrap">{comment.content}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>{formatDate(comment.createdAt)}</span>
            {comment.isEdited && <span className="text-gray-400">(수정됨)</span>}
            {/* 부모 댓글에만 답글 달기 버튼 표시 */}
            {comment.parentId === null && (
                <button onClick={() => onStartReply(comment.id)} className="font-semibold hover:underline">답글 달기</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function TaskComments({ task }) {
  const { data: comments, isLoading } = useGetComments(task.id);
  const createCommentMutation = useCreateComment();
  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();

  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');
  
  // 대댓글 관련 상태
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const { user: currentUser } = useContext(AuthContext);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;
    createCommentMutation.mutate({ issueId: task.id, memberId: currentUser.id, content: newComment.trim() });
    setNewComment('');
  };

  const handleStartEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
    setReplyingToCommentId(null); // 수정 모드 시 답글 모드 해제
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleSaveEdit = (commentId) => {
    if (!editContent.trim()) return;
    updateCommentMutation.mutate(
      { commentId, content: editContent.trim() },
      { onSuccess: () => setEditingCommentId(null) }
    );
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  // 대댓글 핸들러
  const handleStartReply = (commentId) => {
    setReplyingToCommentId(commentId);
    setEditingCommentId(null); // 답글 모드 시 수정 모드 해제
  };

  const handleCancelReply = () => {
    setReplyingToCommentId(null);
    setReplyContent('');
  };

  const handleSubmitReply = (e, parentId) => {
    e.preventDefault();
    if (!replyContent.trim() || !currentUser) return;
    createCommentMutation.mutate(
      { issueId: task.id, memberId: currentUser.id, content: replyContent.trim(), parentId },
      { onSuccess: () => {
          setReplyingToCommentId(null);
          setReplyContent('');
        }}
    );
  };

  if (isLoading) return <div className="p-6 text-center">댓글을 불러오는 중...</div>;

  return (
    <div className="col-span-2">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">댓글 ({comments?.length || 0})</h3>
        
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {!comments || comments.length === 0 ? (
            <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg"><p className="text-gray-500">첫 번째 댓글을 작성하세요</p></div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id}>
                <Comment 
                  comment={comment} 
                  onStartEdit={handleStartEdit}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                  onDelete={handleDeleteComment}
                  onStartReply={handleStartReply}
                  editingCommentId={editingCommentId}
                  editContent={editContent}
                  setEditContent={setEditContent}
                  currentUser={currentUser}
                />

                {/* 대댓글 입력창 */}
                {replyingToCommentId === comment.id && (
                  <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="ml-12 mt-2 space-y-2">
                    <textarea 
                      value={replyContent} 
                      onChange={(e) => setReplyContent(e.target.value)} 
                      className="w-full p-2 border border-gray-300 rounded-md resize-none" 
                      rows="2" 
                      placeholder={`${comment.memberName}에게 답글 달기...`}
                      autoFocus
                    />
                    <div className="flex space-x-2">
                      <button type="submit" className="createBtn">답글 작성</button>
                      <button type="button" onClick={handleCancelReply} className="cancelBtn">취소</button>
                    </div>
                  </form>
                )}

                {/* 대댓글 목록 */}
                {comment.children && comment.children.length > 0 && (
                  <div className="ml-12 mt-4 space-y-4 border-l-2 border-gray-200 pl-4">
                    {comment.children.map(child => (
                      <Comment 
                        key={child.id} 
                        comment={child} 
                        onStartEdit={handleStartEdit}
                        onSaveEdit={handleSaveEdit}
                        onCancelEdit={handleCancelEdit}
                        onDelete={handleDeleteComment}
                        onStartReply={handleStartReply} // 대댓글에는 답글달기 없음
                        editingCommentId={editingCommentId}
                        editContent={editContent}
                        setEditContent={setEditContent}
                        currentUser={currentUser}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {currentUser && (
          <form onSubmit={handleSubmitComment} className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">{currentUser.name[0]}</span>
              </div>
              <div className="flex-1">
                <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} className="w-full bg-white p-3 border border-gray-300 rounded-md resize-none focus:outline-none" rows="3" placeholder="댓글을 입력하세요..." disabled={createCommentMutation.isLoading} />
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={!newComment.trim() || createCommentMutation.isLoading} className="createBtn">
                {createCommentMutation.isLoading ? '작성 중...' : '댓글 작성'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default TaskComments;

import { useEffect, useMemo, useState } from "react";
import { getVideoComments, addComment, updateComment, deleteComment } from "../../api/comments.js";
import useAuth from "../../hooks/useAuth.js";
import { Link } from "react-router-dom";

const CommentItem = ({ comment, onEdit, onDelete, isOwner, isAuthed }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(comment.content);

  const save = async () => {
    if (!isAuthed) return;
    await onEdit(comment._id, text);
    setIsEditing(false);
  };

  return (
    <div className="p-3 border rounded">
      {!isEditing ? (
        <p className="text-sm text-gray-900 whitespace-pre-wrap">{comment.content}</p>
      ) : (
        <div className="space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border rounded p-2 text-sm"
            rows={3}
          />
          <div className="flex gap-2">
            <button onClick={save} disabled={!isAuthed} className="px-3 py-1 text-xs bg-indigo-600 text-white rounded disabled:opacity-50">Save</button>
            <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-xs bg-gray-200 rounded">Cancel</button>
          </div>
        </div>
      )}

      {isOwner && !isEditing && (
        <div className="mt-2 flex gap-2">
          <button onClick={() => isAuthed && setIsEditing(true)} disabled={!isAuthed} className="text-xs text-indigo-600 disabled:opacity-50">Edit</button>
          <button onClick={() => isAuthed && onDelete(comment._id)} disabled={!isAuthed} className="text-xs text-red-600 disabled:opacity-50">Delete</button>
        </div>
      )}
    </div>
  );
};

const VideoComments = ({ videoId, currentUserId, onTotalChange }) => {
  const { user } = useAuth();
  const isAuthed = Boolean(user);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [newComment, setNewComment] = useState("");

  const emitTotal = (value) => {
    setTotal(value || 0);
    if (typeof onTotalChange === "function") onTotalChange(value || 0);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getVideoComments(videoId, page, limit);
        // Controller returns: { totalComments, page, limit, all_comments }
        const data = res?.data || {};
        setItems(data.all_comments || []);
        emitTotal(data.totalComments || 0);
      } catch (e) {
        setError(typeof e === "string" ? e : e?.message || "Failed to load comments");
      } finally {
        setLoading(false);
      }
    };
    if (videoId) load();
  }, [videoId, page, limit]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const submit = async () => {
    if (!isAuthed) {
      return;
    }
    if (!newComment.trim()) return;
    try {
      await addComment(videoId, { content: newComment.trim() });
      setNewComment("");
      const res = await getVideoComments(videoId, page, limit);
      const data = res?.data || {};
      setItems(data.all_comments || []);
      emitTotal(data.totalComments || 0);
    } catch (e) {
      const msg = typeof e === "string" ? e : e?.message || "Failed to add comment";
      alert(msg);
    }
  };

  const onEdit = async (commentId, content) => {
    if (!isAuthed) return;
    try {
      await updateComment(commentId, { content });
      setItems((prev) => prev.map((c) => (c._id === commentId ? { ...c, content } : c)));
    } catch (e) {
      alert(typeof e === "string" ? e : e?.message || "Failed to update comment");
    }
  };

  const onDelete = async (commentId) => {
    if (!isAuthed) return;
    try {
      await deleteComment(commentId);
      setItems((prev) => prev.filter((c) => c._id !== commentId));
      emitTotal(total - 1);
    } catch (e) {
      alert(typeof e === "string" ? e : e?.message || "Failed to delete comment");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Comments</h2>

      {!isAuthed && (
        <div className="p-3 border rounded bg-gray-50 text-sm text-gray-700">
          Please <Link to="/login" className="text-indigo-600">login</Link> to participate in the discussion.
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={isAuthed ? "Add a comment" : "Login to comment"}
          className="flex-1 border rounded p-2 text-sm"
          disabled={!isAuthed}
        />
        <button onClick={submit} disabled={!isAuthed} className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50">
          Comment
        </button>
      </div>

      {loading && <div className="text-gray-600">Loading comments...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="space-y-3">
          {items.map((c) => (
            <CommentItem key={c._id} comment={c} onEdit={onEdit} onDelete={onDelete} isOwner={c.owner === currentUserId} isAuthed={isAuthed} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VideoComments;

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getVideoById } from "../../api/videos.js";
import { toggleLikeVideo, getLikedVideos } from "../../api/likes.js";
import { getMyPlaylists, createPlaylist, addVideoToPlaylist } from "../../api/playlists.js";
import VideoComments from "../Comments/VideoComments.jsx";
import useAuth from "../../hooks/useAuth.js";

const MetaItem = ({ label, value }) => (
  <div>
    <span className="text-gray-500 text-sm mr-2">{label}:</span>
    <span className="text-gray-900 text-sm capitalize">{value || "-"}</span>
  </div>
);

const VideoDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isAuthed = Boolean(user);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liking, setLiking] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(null); // null means unknown (no endpoint yet)
  const [commentCount, setCommentCount] = useState(0);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [myPlaylists, setMyPlaylists] = useState([]);
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getVideoById(id);
        const v = res?.data || null;
        setVideo(v);
        setIsLiked(false);
      } catch (e) {
        setError(typeof e === "string" ? e : e?.message || "Failed to load video");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    const loadLikeStatus = async () => {
      if (!isAuthed || !id) return;
      try {
        const res = await getLikedVideos();
        const list = Array.isArray(res?.data) ? res.data : (res?.data?.likedVideos || []);
        // list entries may be objects with videoDetails or raw video Id depending on backend; try both
        const likedIds = list.map((x) => x?.videoDetails?._id || x?.video || x?._id).filter(Boolean);
        setIsLiked(likedIds.includes(id));
      } catch (_) {
        // ignore
      }
    };
    loadLikeStatus();
  }, [isAuthed, id]);

  const onTotalCommentsChange = (total) => setCommentCount(total || 0);

  const onToggleLike = async () => {
    if (!isAuthed) return;
    setLiking(true);
    const nextLiked = !isLiked;
    if (likeCount !== null) {
      setLikeCount((c) => (nextLiked ? (c ?? 0) + 1 : Math.max(0, (c ?? 0) - 1)));
    }
    setIsLiked(nextLiked);
    try {
      await toggleLikeVideo(id);
    } catch (e) {
      // revert on failure
      setIsLiked(!nextLiked);
      if (likeCount !== null) {
        setLikeCount((c) => (!nextLiked ? (c ?? 0) + 1 : Math.max(0, (c ?? 0) - 1)));
      }
    } finally {
      setLiking(false);
    }
  };

  const openPlaylistModal = async () => {
    if (!isAuthed) return;
    setShowPlaylistModal(true);
    setShowCreateForm(false);
    setNewPlaylistName("");
    setNewPlaylistDescription("");
    setLoadingPlaylists(true);
    try {
      const res = await getMyPlaylists();
      const data = Array.isArray(res?.data) ? res.data : res?.data?.playlists || res?.data || [];
      setMyPlaylists(data);
    } catch (e) {
      setMyPlaylists([]);
    } finally {
      setLoadingPlaylists(false);
    }
  };

  const closePlaylistModal = () => {
    setShowPlaylistModal(false);
  };

  const handleCreatePlaylistAndAdd = async () => {
    if (!newPlaylistName.trim() || !newPlaylistDescription.trim()) return;
    setCreatingPlaylist(true);
    try {
      await createPlaylist({
        name: newPlaylistName.trim(),
        description: newPlaylistDescription.trim(),
        videos: [id],
      });
      alert("Playlist created and video added");
      closePlaylistModal();
    } catch (e) {
      alert(typeof e === "string" ? e : e?.message || "Failed to create playlist");
    } finally {
      setCreatingPlaylist(false);
    }
  };

  const handleAddToExisting = async (playlistId) => {
    try {
      await addVideoToPlaylist(playlistId, id);
      alert("Video added to playlist");
      closePlaylistModal();
    } catch (e) {
      alert(typeof e === "string" ? e : e?.message || "Failed to add to playlist");
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto bg-white shadow rounded-lg p-6 text-center text-gray-600">
        Loading video...
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="max-w-5xl mx-auto bg-white shadow rounded-lg p-6 text-center">
        <p className="text-red-600">{error || "Video not found"}</p>
        <Link to="/" className="text-indigo-600 hover:text-indigo-700 inline-block mt-4">Back to Videos</Link>
      </div>
    );
  }

  const likeButtonClasses = !isAuthed
    ? "px-4 py-2 rounded bg-gray-300 text-gray-600 cursor-not-allowed"
    : isLiked
    ? "px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
    : "px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white shadow rounded-lg p-4">
        <div className="aspect-video w-full bg-black rounded overflow-hidden">
          <video src={video.videofile} controls className="w-full h-full" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">{video.title}</h1>
        <p className="mt-2 text-gray-700">{video.description}</p>

        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <MetaItem label="Category" value={video.category} />
          <MetaItem label="Difficulty" value={video.difficulty} />
          <MetaItem label="Duration" value={video.duration} />
          <MetaItem label="Published" value={video.isPublished ? "yes" : "no"} />
        </div>

        {Array.isArray(video.tags) && video.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {video.tags.map((t) => (
              <span key={t} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">#{t}</span>
            ))}
          </div>
        )}

        {!isAuthed && (
          <div className="mt-4 p-3 border rounded bg-gray-50 text-sm text-gray-700">
            Please <Link to="/login" className="text-indigo-600">login</Link> to like this video.
          </div>
        )}

        <div className="mt-4 flex items-center gap-4">
          <button onClick={onToggleLike} disabled={!isAuthed || liking} className={likeButtonClasses}>
            {isLiked ? "Unlike" : "Like"}
          </button>
          <button
            onClick={openPlaylistModal}
            disabled={!isAuthed}
            className={!isAuthed ? "px-4 py-2 rounded bg-gray-300 text-gray-600 cursor-not-allowed" : "px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"}
          >
            Add to Playlist
          </button>
          <div className="text-sm text-gray-600">
            <span className="mr-4">Likes: <span className="text-gray-900">{likeCount ?? "—"}</span></span>
            <span>Comments: <span className="text-gray-900">{commentCount}</span></span>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">More</h2>
        <div className="text-sm text-gray-600">
          Owner ID: <span className="text-gray-900">{video.owner || "-"}</span>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <VideoComments videoId={id} currentUserId={user?._id} onTotalChange={onTotalCommentsChange} />
      </div>

      {showPlaylistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Add to Playlist</h3>
              <button onClick={closePlaylistModal} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            {loadingPlaylists ? (
              <div className="text-gray-600">Loading...</div>
            ) : (
              <div className="space-y-3">
                {myPlaylists.length === 0 ? (
                  <div>
                    <div className="text-sm text-gray-700 mb-2">You have no playlists. Create one to add this video.</div>
                    <div className="space-y-2">
                      <input
                        placeholder="Playlist name"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        className="border rounded p-2 w-full text-sm"
                      />
                      <input
                        placeholder="Description"
                        value={newPlaylistDescription}
                        onChange={(e) => setNewPlaylistDescription(e.target.value)}
                        className="border rounded p-2 w-full text-sm"
                      />
                      <button
                        onClick={handleCreatePlaylistAndAdd}
                        disabled={creatingPlaylist}
                        className="w-full px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
                      >
                        {creatingPlaylist ? "Creating..." : "Create and Add"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowCreateForm((v) => !v)}
                      className="w-full px-3 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200 text-left"
                    >
                      {showCreateForm ? "Hide" : "➕ Create new playlist"}
                    </button>
                    {showCreateForm && (
                      <div className="space-y-2">
                        <input
                          placeholder="Playlist name"
                          value={newPlaylistName}
                          onChange={(e) => setNewPlaylistName(e.target.value)}
                          className="border rounded p-2 w-full text-sm"
                        />
                        <input
                          placeholder="Description"
                          value={newPlaylistDescription}
                          onChange={(e) => setNewPlaylistDescription(e.target.value)}
                          className="border rounded p-2 w-full text-sm"
                        />
                        <button
                          onClick={handleCreatePlaylistAndAdd}
                          disabled={creatingPlaylist}
                          className="w-full px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
                        >
                          {creatingPlaylist ? "Creating..." : "Create and Add"}
                        </button>
                      </div>
                    )}
                    <div className="max-h-60 overflow-y-auto divide-y">
                      {myPlaylists.map((p) => (
                        <div key={p._id} className="py-2 flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{p.name}</div>
                            <div className="text-xs text-gray-600 line-clamp-1">{p.description}</div>
                          </div>
                          <button
                            onClick={() => handleAddToExisting(p._id)}
                            className="px-3 py-1 text-sm bg-green-600 text-white rounded"
                          >
                            Add here
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoDetail;

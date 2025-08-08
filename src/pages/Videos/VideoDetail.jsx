import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getVideoById } from "../../api/videos.js";

const MetaItem = ({ label, value }) => (
  <div>
    <span className="text-gray-500 text-sm mr-2">{label}:</span>
    <span className="text-gray-900 text-sm capitalize">{value || "-"}</span>
  </div>
);

const VideoDetail = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getVideoById(id);
        setVideo(res?.data || null);
      } catch (e) {
        setError(typeof e === "string" ? e : e?.message || "Failed to load video");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleStub = (what) => {
    alert(`${what} coming in next stage`);
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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white shadow rounded-lg p-4">
        <div className="aspect-video w-full bg-black rounded overflow-hidden">
          {/* Basic HTML5 player; video.videofile is a Cloudinary URL */}
          <video
            src={video.videofile}
            controls
            className="w-full h-full"
          />
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

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => handleStub("Like")}
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Like
          </button>
          <button
            onClick={() => handleStub("Bookmark")}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Bookmark
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">More</h2>
        <div className="text-sm text-gray-600">
          Owner ID: <span className="text-gray-900">{video.owner || "-"}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;

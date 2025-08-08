import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllVideos } from "../../api/videos.js";

const VideoCard = ({ video }) => {
  return (
    <Link to={`/videos/${video._id}`} className="block bg-white rounded-lg shadow hover:shadow-md transition p-3">
      <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover rounded" />
      <div className="mt-3">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{video.title}</h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{video.description}</p>
        <div className="text-xs text-gray-400 mt-2 flex justify-between">
          <span className="capitalize">{video.category}</span>
          <span className="capitalize">{video.difficulty}</span>
        </div>
      </div>
    </Link>
  );
};

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAllVideos();
        // ApiResponse shape: { statusCode, data: { results, total, ... }, message, success }
        const results = res?.data?.results || [];
        setVideos(results);
      } catch (e) {
        setError(typeof e === "string" ? e : e?.message || "Failed to load videos");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Videos</h1>

        {loading && (
          <div className="text-center py-12 text-gray-600">Loading videos...</div>
        )}

        {error && !loading && (
          <div className="text-center py-12 text-red-600">{error}</div>
        )}

        {!loading && !error && videos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No videos yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Videos will appear here once they are uploaded.
              </p>
            </div>
          </div>
        )}

        {!loading && !error && videos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((v) => (
              <VideoCard key={v._id} video={v} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoList;

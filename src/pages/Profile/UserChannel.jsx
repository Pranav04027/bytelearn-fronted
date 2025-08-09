import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserChannel } from "../../api/auth.js";
import { getUserPlaylists } from "../../api/playlists.js";

const UserChannel = () => {
  const { username } = useParams();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getUserChannel(username);
        const data = res?.data || res; // be defensive
        setChannel(data || null);

        const userId = data?._id || data?.userId || data?.id;
        if (userId) {
          const pres = await getUserPlaylists(userId);
          const plist = Array.isArray(pres?.data) ? pres.data : pres?.data?.playlists || pres?.data || [];
          setPlaylists(plist);
        } else {
          setPlaylists([]);
        }
      } catch (e) {
        setError(typeof e === "string" ? e : e?.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    };
    if (username) load();
  }, [username]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto bg-white shadow rounded-lg p-6 text-center text-gray-600">Loading...</div>
    );
  }

  if (error || !channel) {
    return (
      <div className="max-w-5xl mx-auto bg-white shadow rounded-lg p-6 text-center">
        <p className="text-red-600">{error || "User not found"}</p>
        <Link to="/" className="text-indigo-600 hover:text-indigo-700 inline-block mt-4">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white shadow rounded-lg">
        {channel?.coverImage ? (
          <img src={channel.coverImage} alt="cover" className="w-full h-40 object-cover rounded-t-lg" />
        ) : (
          <div className="w-full h-40 bg-gray-200 rounded-t-lg" />
        )}
        <div className="p-4 flex items-center gap-4">
          {channel?.avatar ? (
            <img src={channel.avatar} alt={channel.fullname || channel.username} className="h-16 w-16 rounded-full" />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center text-xl text-gray-700">
              {(channel?.fullname || channel?.username || "U").charAt(0)}
            </div>
          )}
          <div>
            <div className="text-xl font-semibold text-gray-900">{channel?.fullname || channel?.username}</div>
            <div className="text-sm text-gray-600">@{channel?.username}</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Playlists</h2>
        {playlists.length === 0 ? (
          <div className="text-sm text-gray-600">No playlists to show.</div>
        ) : (
          <div className="space-y-2">
            {playlists.map((p) => (
              <div key={p._id} className="p-3 border rounded">
                <div className="font-medium text-gray-900">{p.name}</div>
                <div className="text-sm text-gray-600">{p.description}</div>
                {Array.isArray(p.videos) && p.videos.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {p.videos.slice(0, 6).map((v) => (
                      <div key={v._id} className="text-xs text-gray-700 flex items-center gap-2">
                        {v.thumbnail ? (
                          <img src={v.thumbnail} alt={v.title} className="h-10 w-16 object-cover rounded" />
                        ) : (
                          <div className="h-10 w-16 bg-gray-200 rounded" />
                        )}
                        <span className="line-clamp-2">{v.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserChannel;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserPlaylists } from "../../api/playlists.js";

const UserPlaylists = () => {
  const { userId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getUserPlaylists(userId);
        const data = Array.isArray(res?.data) ? res.data : res?.data?.playlists || res?.data || [];
        setItems(data);
      } catch (e) {
        setError(typeof e === "string" ? e : e?.message || "Failed to load playlists");
      } finally {
        setLoading(false);
      }
    };
    if (userId) load();
  }, [userId]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">User Playlists</h1>

        {loading && <div className="text-gray-600">Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && !error && items.length === 0 && (
          <div className="text-gray-600">No playlists yet.</div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="space-y-3">
            {items.map((p) => (
              <div key={p._id} className="p-3 border rounded">
                <div className="font-medium text-gray-900">{p.name}</div>
                <div className="text-sm text-gray-600">{p.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPlaylists;

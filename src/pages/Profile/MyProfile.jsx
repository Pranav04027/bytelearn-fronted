import useAuth from "../../hooks/useAuth.js";
import { useEffect, useState } from "react";
import { getMyPlaylists } from "../../api/playlists.js";
import { Link } from "react-router-dom";

const MyProfile = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getMyPlaylists();
        const data = Array.isArray(res?.data) ? res.data : res?.data?.playlists || res?.data || [];
        setPlaylists(data);
      } catch (_) {
        setPlaylists([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="text-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullname}
                  className="h-32 w-32 rounded-full mx-auto mb-4"
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-gray-300 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-gray-600 text-2xl">
                    {user?.fullname?.charAt(0) || "U"}
                  </span>
                </div>
              )}
              <h2 className="text-xl font-semibold text-gray-900">{user?.fullname}</h2>
              <p className="text-gray-600">@{user?.username}</p>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="mt-1 text-sm text-gray-900">{user?.fullname}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <p className="mt-1 text-sm text-gray-900">{user?.username}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <p className="mt-1 text-sm text-gray-900 capitalize">{user?.role}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">My Playlists</label>
                {loading ? (
                  <div className="text-sm text-gray-600">Loading...</div>
                ) : playlists.length === 0 ? (
                  <div className="text-sm text-gray-600">No playlists yet. Create one from a video or the playlists page.</div>
                ) : (
                  <div className="space-y-2">
                    {playlists.slice(0, 4).map((p) => (
                      <div key={p._id} className="p-2 border rounded">
                        <div className="font-medium text-gray-900 text-sm">{p.name}</div>
                        <div className="text-xs text-gray-600">{p.description}</div>
                      </div>
                    ))}
                    {playlists.length > 4 && (
                      <div className="text-xs text-gray-600">and {playlists.length - 4} more...</div>
                    )}
                    <Link to="/playlists" className="inline-block text-sm text-indigo-600 hover:text-indigo-700">View all</Link>
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                  Edit Profile
                </button>
                <Link to="/playlists" className="bg-gray-100 text-gray-900 px-4 py-2 rounded hover:bg-gray-200">
                  Manage Playlists
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;

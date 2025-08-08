import useAuth from "../../hooks/useAuth.js";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {user?.fullname}</p>
              <p><span className="font-medium">Username:</span> {user?.username}</p>
              <p><span className="font-medium">Email:</span> {user?.email}</p>
              <p><span className="font-medium">Role:</span> {user?.role}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                Upload Video
              </button>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                Create Playlist
              </button>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
                View Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

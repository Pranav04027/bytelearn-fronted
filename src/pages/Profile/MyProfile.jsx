import useAuth from "../../hooks/useAuth.js";

const MyProfile = () => {
  const { user } = useAuth();

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
              
              <div className="pt-4">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;

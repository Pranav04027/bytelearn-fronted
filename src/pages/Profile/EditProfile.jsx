import { useState } from "react";
import { updateAccountDetails } from "../../api/auth.js";
import { Link } from "react-router-dom";

const EditProfile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const onSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      await updateAccountDetails({ username, email });
      setSuccess(true);
    } catch (e) {
      setError(typeof e === "string" ? e : e?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded-lg p-6">
      <h1 className="text-xl font-semibold text-gray-900 mb-4">Edit Profile</h1>

      <label className="block text-sm font-medium text-gray-700">Username</label>
      <input className="border rounded p-2 w-full mb-3" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your username" />

      <label className="block text-sm font-medium text-gray-700">Email</label>
      <input className="border rounded p-2 w-full mb-4" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />

      <div className="flex gap-2">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50" disabled={saving} onClick={onSave}>
          {saving ? "Saving..." : "Save"}
        </button>
        <Link to="/profile" className="px-4 py-2 bg-gray-100 rounded">Back</Link>
      </div>

      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      {success && <div className="mt-3 text-sm text-green-700">Profile updated.</div>}
    </div>
  );
};

export default EditProfile;

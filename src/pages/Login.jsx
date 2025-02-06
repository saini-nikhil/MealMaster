import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import { Loader2, Mail, Lock } from "lucide-react"; // Import Lucide Icons

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) return; // Prevent multiple clicks

    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setError("User not found. Please sign up.");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password. Try again.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else {
        setError("Failed to log in. Please try again.");
      }
      setLoading(false); // Reset loading only on failure
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-500 rounded-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="flex items-center border rounded px-3 py-2">
            <Mail className="text-gray-500 mr-2" size={18} />
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="w-full outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading} // Disable input while loading
            />
          </div>

          {/* Password Field */}
          <div className="flex items-center border rounded px-3 py-2">
            <Lock className="text-gray-500 mr-2" size={18} />
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="w-full outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading} // Disable input while loading
            />
          </div>

          {/* Submit Button with Loading */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              disabled={loading} // Disable button when loading
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} /> Logging in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "../components/ui/ThemeToggle";
import { Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      setError("");
      setLoading(true);
      await register({ username, email, password });
     
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 dark:text-white relative">
      <div className="absolute top-[25px] right-[25px]">

        <ThemeToggle />
      </div>
      <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-xl transition duration-300 ease-in-out w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create your Account</h1>

        {error && <Error message={error} />}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>

  {/* Username */}
  <div className="mb-4">
    <label className="block text-gray-700 dark:text-gray-400 mb-2" htmlFor="username">Username</label>
    <input
      type="text"
      name="username"
      placeholder="Username"
      value={formData.username}
      onChange={handleChange}
      required
      className="w-full px-3 py-2 border dark:border-white rounded dark:text-gray-300 focus:border-blue-500 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
    />
  </div>

  {/* Email */}
  <div className="mb-4">
    <label className="block text-gray-700 dark:text-gray-400 mb-2" htmlFor="email">Email</label>
    <input
      type="text"
      name="email"
      placeholder="Email"
      value={formData.email}
      onChange={handleChange}
      required
      className="w-full px-3 py-2 border dark:border-white rounded dark:text-gray-300 focus:border-blue-500 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
    />
  </div>

  {/* Password */}
  <div className="mb-4 relative ">
    <label className="block text-gray-700 dark:text-gray-400 mb-2" htmlFor="password">Password</label>
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      placeholder="Password"
      value={formData.password}
      onChange={handleChange}
      required
      className="w-full px-3 py-2 border dark:border-white rounded dark:text-gray-300 focus:border-blue-500 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 "
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-11 text-gray-500 dark:text-gray-300 cursor-pointer"
    >
      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
    </button>
  </div>

  {/* Confirm Password */}
  <div className="mb-4 relative">
    <label className="block text-gray-700 dark:text-gray-400 mb-2" htmlFor="confirmPassword">Confirm Password</label>
    <input
      type={showConfirmPassword ? "text" : "password"}
      name="confirmPassword"
      placeholder="Confirm Password"
      value={formData.confirmPassword}
      onChange={handleChange}
      required
      className="w-full px-3 py-2 border dark:border-white rounded dark:text-gray-300 focus:border-blue-500 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
    />
    <button
      type="button"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      className="absolute right-3 top-11 text-gray-500 dark:text-gray-300 cursor-pointer"
    >
      {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
    </button>
  </div>

  <button
    type="submit"
    disabled={loading}
    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
  >
    {loading ? "Creating account..." : "Sign up"}
  </button>

  <p className="mt-4 text-center">
    Already have an account?{" "}
    <Link to="/login" className="text-blue-500 hover:underline">
      Login
    </Link>
  </p>
</form>
      </div>
    </div>
  );
};

export default Signup;

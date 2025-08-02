import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "../components/ui/ThemeToggle";
import { Eye, EyeOff } from 'lucide-react';
import Error from "../components/ui/Error";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, loading } = useAuth();
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getPasswordStrength = (password) => {
    if (!password) return 0;
    if (password.length < 6) return 1;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return 3;
    return 2;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    // Validation checks
    if (!username.trim()) {
      return setError("Username is required");
    }

    if (username.length < 3) {
      return setError("Username should be at least 3 characters long");
    }

    if (!validateEmail(email)) {
      return setError("Please enter a valid email address");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      await register({ username, email, password });
    } catch (err) {
      
      setError(
        typeof err?.response?.data?.error === "string"
          ? err.response.data.error
          : err.message || "Failed to create account"
      );
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
            <label className="block text-gray-700 dark:text-gray-400 mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              onBlur={() => handleBlur('username')}
              required
              className={`w-full px-3 py-2 border rounded dark:text-gray-300 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 ${
                touched.username && !formData.username 
                  ? 'border-red-500' 
                  : 'dark:border-white focus:border-blue-500'
              }`}
            />
            {touched.username && !formData.username && (
              <p className="text-red-500 text-sm mt-1">Username is required</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-400 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              required
              className={`w-full px-3 py-2 border rounded dark:text-gray-300 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 ${
                touched.email && !validateEmail(formData.email) 
                  ? 'border-red-500' 
                  : 'dark:border-white focus:border-blue-500'
              }`}
            />
            {touched.email && !validateEmail(formData.email) && (
              <p className="text-red-500 text-sm mt-1">Please enter a valid email</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 dark:text-gray-400 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              required
              className={`w-full px-3 py-2 border rounded dark:text-gray-300 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 ${
                touched.password && formData.password.length < 6 
                  ? 'border-red-500' 
                  : 'dark:border-white focus:border-blue-500'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-500 dark:text-gray-300 cursor-pointer"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600 mt-2">
              <div 
                className={`h-2.5 rounded-full ${
                  getPasswordStrength(formData.password) === 1 ? 'bg-red-500' :
                  getPasswordStrength(formData.password) === 2 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`} 
                style={{width: `${Math.min(100, formData.password.length * 10)}%`}}
              ></div>
            </div>
            {touched.password && formData.password.length < 6 && (
              <p className="text-red-500 text-sm mt-1">Password must be at least 6 characters</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 dark:text-gray-400 mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={() => handleBlur('confirmPassword')}
              required
              className={`w-full px-3 py-2 border rounded dark:text-gray-300 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 ${
                touched.confirmPassword && formData.password !== formData.confirmPassword 
                  ? 'border-red-500' 
                  : 'dark:border-white focus:border-blue-500'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-10 text-gray-500 dark:text-gray-300 cursor-pointer"
            >
              {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
            {touched.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">Passwords don't match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed"
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
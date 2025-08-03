import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "../components/ui/ThemeToggle";
import Error from "../components/ui/Error";
import { handleSuccess } from "../components/ui/toastFun";
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  useEffect(() => {
    if (location.state?.showToast) {
      handleSuccess("User Created Successfully!");
    }
  }, [location]);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!validateEmail(formData.email)) {
      return setError("Please enter a valid email address");
    }

    if (!formData.password) {
      return setError("Password is required");
    }

    try {
      await login({ email: formData.email, password: formData.password });
      navigate("/"); // Redirect on successful login
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.error || 
        err.error || 
        "Invalid email or password"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 dark:text-white relative">
      <div className="absolute top-[25px] right-[25px]">
        <ThemeToggle />
      </div>
      
      <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-xl transition duration-300 ease-in-out w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        
        {error && <Error message={error} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-400 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
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
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              required
              className={`w-full px-3 py-2 border rounded dark:text-gray-300 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 ${
                touched.password && !formData.password
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
            {touched.password && !formData.password && (
              <p className="text-red-500 text-sm mt-1">Password is required</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-4 text-center">
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              className="text-blue-500 hover:underline hover:text-blue-600 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "../components/ui/ThemeToggle";
import Error from "../components/ui/Error";
import { handleSuccess } from "../components/ui/toastFun";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const location = useLocation();
  const { login, loading } = useAuth(); // using AuthContext

  useEffect(() => {
    if (location.state?.showToast) {
      handleSuccess("User Created Successfully!");
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login({ email, password }); // ⬅️ from context
      
      
      
    } catch (err) {

      
      setError("Invalid email or password");

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 dark:text-white relative">
      <div className="absolute top-[25px] right-[25px]">

        <ThemeToggle />
      </div>
      <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-xl transition duration-300 ease-in-out w-full max-w-md ">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {error && <Error message={error? error : "Error"} />}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-400 mb-2" htmlFor="email">
              Email
            </label>
            <input
  type="email"
  id="email"
  className={`w-full px-3 py-2 border dark:border-white rounded dark:text-gray-300 focus:border-blue-500 focus:outline-none  placeholder-gray-400
              dark:placeholder-gray-500
    `}
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>

          </div>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-400 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border dark:border-white rounded dark:text-gray-300 focus:border-blue-500 focus:outline-none placeholder-gray-400
              dark:placeholder-gray-500"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>

    </div>
  );
};

export default Login;

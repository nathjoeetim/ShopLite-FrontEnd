import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../components/store/store"; // adjust path
import { login, logout } from "../components/store/slices/authSlice";
import { v4 as uuidv4 } from "uuid"; // for unique token

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      // LOGIN FLOW
      const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const existingUser = savedUsers.find(
        (u: any) => u.email === email && u.password === password
      );

      if (existingUser) {
        dispatch(
          login({ email: existingUser.email, token: existingUser.token })
        );
        navigate("/");
      } else {
        alert("Invalid email or password ❌");
      }
    } else {
      // SIGNUP FLOW
      if (password !== confirmPassword) {
        alert("Passwords do not match ❌");
        return;
      }

      const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");

      // check if email already exists
      const exists = savedUsers.find((u: any) => u.email === email);
      if (exists) {
        alert("User already exists with this email ❌");
        return;
      }

      const newUser = {
        id: uuidv4(),
        fullName,
        email,
        password,
        token: uuidv4(),
      };

      savedUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(savedUsers));

      // auto-login after signup
      dispatch(login({ email: newUser.email, token: newUser.token }));
      navigate("/");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>

        {isAuthenticated ? (
          <div className="text-center space-y-4">
            <p className="text-gray-700">
              Hello,{" "}
              <span className="font-semibold">
                {typeof user === "object" && user !== null ? user.email : user}
              </span>{" "}
              🎉
            </p>
            <button
              onClick={handleLogout}
              className="w-full py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold rounded-lg hover:opacity-90 transition"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
        )}

        {!isAuthenticated && (
          <p className="mt-6 text-center text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(prev => !prev)}
              className="text-indigo-600 font-semibold hover:underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

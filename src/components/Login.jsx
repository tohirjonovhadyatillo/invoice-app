import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Iltimos, email va parolni kiriting");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Kirish muvaffaqiyatli!");
      navigate("/"); 
    } catch (error) {
      toast.error("Xato: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Google orqali muvaffaqiyatli kirdingiz!");
      navigate("/");
    } catch (error) {
      toast.error("Xato: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Kirish</h2>
          <p className="mt-2 text-sm text-gray-600">
            Iltimos, hisobingizga kirish uchun ma'lumotlarni kiriting
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email manzilingiz"
              className="w-full px-3 py-3 border border-gray-300 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Parol"
              className="w-full px-3 py-3 border border-gray-300 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="h-4 w-4 text-blue-600" />
              <span className="text-gray-900">Eslab qolish</span>
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              Parolni unutdingizmi?
            </a>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition ${loading && "opacity-70 cursor-not-allowed"}`}
          >
            {loading ? "Kirish..." : "Kirish"}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Yoki</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
          >
            Google orqali kirish
          </button>

          <p className="text-center text-sm text-gray-600">
            Hisobingiz yo'qmi?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Ro'yxatdan o'tish
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

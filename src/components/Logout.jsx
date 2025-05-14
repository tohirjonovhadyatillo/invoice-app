import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { IoIosLogOut } from "react-icons/io";

const LogOut = () => {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      toast.success("Muvaffaqiyatli chiqildi!");
      navigate("/login"); 
    } catch (error) {
      toast.error(`Chiqishda xato: ${error.message}`);
    }
  };

  return (
    <button
      onClick={handleLogOut}
      className="px-3 bg-red-500 py-2 text-white rounded hover:bg-red-600 transition-colors"
    >
      <IoIosLogOut />
    </button>
  );
};

export default LogOut;
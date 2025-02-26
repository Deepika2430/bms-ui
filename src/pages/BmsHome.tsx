import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, login } from "@/services/authService";
import AuthForm from "@/components/AuthForm";

export default function BmsHome() {
  const [showDialog, setShowDialog] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", name: "", empId: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Email and Password are required!");
      return;
    }
    if (isRegister && (!form.name || !form.empId)) {
      setError("Name and Employee ID are required for registration!");
      return;
    }
    setError("");

    try {
      if (isRegister) {
        await register(form.name, form.email, form.password);
        alert("Registration Successful!");
      } else {
        await login(form.email, form.password);
        alert("Login Successful!");
      }
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold">Welcome to BMS</h1>
      <button onClick={() => setShowDialog(true)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Login
      </button>

      {/* Modal */}
      {showDialog && <AuthForm onClose={() => setShowDialog(false)} />}
    </div>
  );
}

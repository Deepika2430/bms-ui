import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, login, setAuthToken } from "@/services/authService";
import { toast } from "react-toastify";

export default function AuthForm({ onClose }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    empId: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Email and Password are required!");
      toast.error("Email and Password are required!");
      return;
    }
    if (isRegister && (!form.name || !form.empId)) {
      setError("Name and Employee ID are required for registration!");
      toast.error("Name and Employee ID are required for registration!");
      return;
    }
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        await register(form.name, form.email, form.password);
        toast.success("Registration Successful!");
      } else {
        const response = await login(form.email, form.password);
        setAuthToken(response.token);
        toast.success("Login Successful!");
      }
      navigate("/home");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-2">
          {isRegister ? "Register" : "Login"}
        </h2>

        {/* Form with Loading Overlay */}
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-lg">
              <div className="loader"></div> {/* Ensures spinner is visible */}
              <p className="text-gray-500">Please wait...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {isRegister && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                  disabled={loading}
                />
                <input
                  type="text"
                  name="empId"
                  placeholder="Employee ID"
                  value={form.empId}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                  disabled={loading}
                />
              </>
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              disabled={loading}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              disabled={loading}
            />
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded"
              disabled={loading}
            >
              {isRegister ? "Register" : "Login"}
            </button>
          </form>
        </div>

        <p
          className="mt-3 text-sm cursor-pointer text-blue-600"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? "Already have an account? Login" : "New user? Register"}
        </p>
      </div>
    </div>
  );
}

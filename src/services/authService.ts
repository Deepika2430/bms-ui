import Cookies from "js-cookie";

export const register = async (name: string, email: string, password: string) => {
  const response = await fetch("http://localhost:4000/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return response.json();
};

export const login = async (email: string, password: string) => {
  const response = await fetch("http://localhost:4000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();
  localStorage.setItem("token", data.token);
  return data;
};

export const setAuthToken = (token: string) => {
  Cookies.set("authToken", token, { secure: true, sameSite: 'Strict', expires: 1 });
};

export const getToken = () => {
    return Cookies.get("authToken");
}

export const clearAuthToken = () => {
  Cookies.remove("authToken");
};

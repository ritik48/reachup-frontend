const BACKEND = import.meta.env.VITE_BACKEND || "http://127.0.0.1:3000";

// TO GET THE LOGGED IN USER DETAILS
const getUser = async () => {
  const res = await fetch(`${BACKEND}/user`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();

  return data;
};

const userLogin = async (email: string, password: string) => {
  const res = await fetch(`${BACKEND}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();

  return data;
};

const userSignup = async (name: string, email: string, password: string) => {
  const res = await fetch(`${BACKEND}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();

  return data;
};

const userLogout = async () => {
  const res = await fetch(`${BACKEND}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  const data = await res.json();

  return data;
};

export { getUser, userLogin, userSignup, userLogout };

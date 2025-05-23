import React, { createContext, useContext, useEffect, useState } from "react";

import { getUser, userLogin, userLogout, userSignup } from "../apis";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type User = {
  _id: string;
  email: string;
  name: string;
};

interface ValueProp {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<ValueProp>({
  user: null,
  loading: false,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

interface PropType {
  children: React.ReactNode;
}

const UserProvider = ({ children }: PropType) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const data = await getUser();

      if (data.success) {
        setUser(data.user);
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await userLogin(email, password);
    if (!data.success) {
      toast.error(data.message);
      return;
    }

    setUser(data.user);
    toast.success(data.message);
    navigate("/");
  };

  const signup = async (name: string, email: string, password: string) => {
    const data = await userSignup(name, email, password);
    console.log(data);
    if (!data.success) {
      toast.error(data.message);
      return;
    }
    console.log({ data });

    setUser(data.user);
    toast.success(data.message);
    navigate("/login");
  };

  const logout = async () => {
    const data = await userLogout();

    if (!data.success) {
      toast.error(data.message);
      return;
    }

    toast.success(data.message);
    setUser(null);
    navigate("/");
  };

  return (
    <UserContext.Provider value={{ signup, user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const userContext = useContext(UserContext);
  if (userContext === undefined) {
    throw new Error("useUser must be used within a UserContext.Provider");
  }

  return userContext;
};

export default useUser;

export { useUser, UserProvider };

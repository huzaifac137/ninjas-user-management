import { createContext, useState, useEffect, type ReactNode } from "react";

interface IRole {
    _id: string;
    name: string;
}

interface ILoggedInUser {
  name: string;
  email: string;
  role: IRole
}

interface AuthContextType {
  token: string;
  user: ILoggedInUser;
  setToken: (token: string) => void;
  setUser: (user: ILoggedInUser) => void;
  isLoading:boolean;
}

export const AuthContext = createContext<AuthContextType>({
  token: "",
  user: {
    name: "",
    email: "",
    role:{
        _id: "",
        name : ""
    }
  },
  setToken: () => {},
  setUser: () => {},
  isLoading:true
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string>("");
  const [user, setUserState] = useState<ILoggedInUser>({
    name: "",
    email: "",
    role : {
        _id: "",
        name: ""
    }
  });
  const [isLoading , setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");

    if (storedToken) setTokenState(storedToken);
    if (storedUser) setUserState(JSON.parse(storedUser));

    setIsLoading(false);
  }, []);


  const setToken = (newToken: string) => {
    localStorage.setItem("auth_token", newToken);
    setTokenState(newToken);
  };

  const setUser = (newUser: ILoggedInUser) => {
    localStorage.setItem("auth_user", JSON.stringify(newUser));
    setUserState(newUser);
  };

  return (
    <AuthContext.Provider value={{ token, user, setToken, setUser , isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

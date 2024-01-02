import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

type UserContextType = {
  user?: User;
  id?: string;
  email?: string;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({} as UserContextType);

export default function UserProvider(props: { children: React.ReactNode }) {
  const { children } = props;

  const [user, setUser] = useState<User | undefined>(undefined);
  const [id, setId] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);

  const supabase = createClient();

  const getCurrentSession = async () => {
    const res = await supabase.auth.getSession();
    if (res && res.data.session) {
      return res.data.session;
    }

    clearUser();
    return null;
  };

  const getCurrentUser = async () => {
    if (id) return;

    const res = await supabase.auth.getUser();
    if (res && res.data.user) {
      const currentUser = res.data.user;
      setUser(currentUser);
      setId(currentUser.id);
      setEmail(currentUser.email);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    clearUser();
    return;
  };

  const clearUser = () => {
    setUser(undefined);
    setId(undefined);
    setEmail(undefined);
  };

  useEffect(() => {
    const isUser = async () => {
      const currentSesson = await getCurrentSession();
      if (currentSesson) await getCurrentUser();
    };
    isUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, id, email, signOut, getCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);

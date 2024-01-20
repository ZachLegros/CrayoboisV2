import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Role } from "@prisma/client";

type UserStore = {
  user?: User;
  id?: string;
  email?: string;
  role?: Role;
  supabase: any;
  getCurrentSession: () => Promise<void>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: undefined,
  id: undefined,
  email: undefined,
  role: undefined,
  supabase: createClient(),

  getCurrentSession: async () => {
    const res = await get().supabase.auth.getSession();
    if (res && res.data.session) {
      return res.data.session;
    }

    get().clearUser();
    return null;
  },

  signOut: async () => {
    await get().supabase.auth.signOut();
    get().clearUser();
    return;
  },

  getCurrentUser: async () => {
    if (get().id) return;

    const res = await get().supabase.auth.getUser();
    if (res && res.data.user) {
      const currentUser = res.data.user;
      set({
        user: currentUser,
        id: currentUser.id,
        email: currentUser.email,
      });
      const userData = await fetch(`/api/user_role?user_id=${currentUser.id}`).then(
        (res) => res.json()
      );
      if (userData?.role) {
        set({ role: userData.role });
      }
    }
  },

  clearUser: () => {
    set({
      user: undefined,
      id: undefined,
      email: undefined,
      role: undefined,
    });
  },
}));

export default useUserStore;

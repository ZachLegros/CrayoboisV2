import { createClient } from "@/lib/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

type UserStore = {
  user?: User;
  id?: string;
  email?: string;
  supabase: ReturnType<typeof createClient>;
  getCurrentSession: () => Promise<Session | null>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>((set, get) => ({
  supabase: createClient(),

  getCurrentSession: async () => {
    const res = await get().supabase.auth.getSession();
    if (res?.data.session) {
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
    if (res?.data.user) {
      const currentUser = res.data.user;
      set({
        user: currentUser,
        id: currentUser.id,
        email: currentUser.email,
      });
    }
  },

  clearUser: () => {
    set({
      user: undefined,
      id: undefined,
      email: undefined,
    });
  },
}));

export default useUserStore;

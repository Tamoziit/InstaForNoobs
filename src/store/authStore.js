import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user-info")), //initially the state is either null, if user-info doesn't exist, else it is not null & user-info exists, i.e., the user has an acc.
  login: (user) => set({ user }), //login state
  logout: () => set({ user: null }), //logout state
  setUser: (user) => set({ user }),
}));

export default useAuthStore;

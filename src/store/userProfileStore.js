import { create } from "zustand";

const useUserProfileStore = create((set) => ({
  userProfile: null,
  setUserProfile: (userProfile) => set({ userProfile }), //setValue : (setterFunction)
  //to update no. of posts in profile page
  addPost: (post) =>
    set((state) => ({
      userProfile: {
        ...state.userProfile,
        posts: [post.id, ...state.userProfile.posts],
      }, //setValue : (setterFunction) => set(state => ({object})) --> here, object is 'userProfile', within which we are spreading(...state.userProfile), ad adding new post to already existing posts.
    })),
  deletePost: (postId) => set((state) => ({
    userProfile: {
      ...state.userProfile,
      posts: state.userProfile.posts.filter((id) => id !== postId),
    },
  })),
}));
export default useUserProfileStore;

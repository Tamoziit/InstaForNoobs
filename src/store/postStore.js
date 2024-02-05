import { create } from "zustand";

const usePostStore = create((set) => ({
  posts: [],
  createPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  deletePost: (id) =>
    set((state) => ({ posts: state.posts.filter((post) => post.id !== id) })),
  setPosts: (posts) => set({ posts }),
  addComment: (postId, comment) =>
    set((state) => ({
      //setting state posts
      posts: state.posts.map((post) => {
        //mapping all posts
        if (post.id === postId) {
          //finding the post we want to comment on
          return {
            ...post,
            comments: [...post.comments, comment], //adding new comment to comments array.
          };
        }
        return post; //returning other posts in their original state if the post is not the post we want to comment on.
      }),
    })),
}));

export default usePostStore;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    fetchPostsHot,
    fetchPostsNew,
    fetchPostsTop,
    fetchSubredditAbout,
    fetchComments,
    fetchSearchResults
} from "../api/reddit-api";

export const loadPostsHot = createAsyncThunk(
    "app/loadSubredditPostsHot",
    async (subreddit) => {
        return await fetchPostsHot(subreddit);
    }
);

export const loadPostsNew = createAsyncThunk(
    "app/loadSubredditPostsNew",
    async (subreddit) => {
        return await fetchPostsNew(subreddit);
    }
);

export const loadPostsTop = createAsyncThunk(
    "app/loadSubredditPostsTop",
    async (subreddit) => {
        return await fetchPostsTop(subreddit);
    }
);

export const loadSearchResults = createAsyncThunk(
    "app/loadSearchResults",
    async (searchTerm) => {
        return await fetchSearchResults(searchTerm);
    }
);

export const loadSubredditAbout = createAsyncThunk(
    "app/loadSubredditAbout",
    async (subreddit) => {
        return await fetchSubredditAbout(subreddit)
    }
);

export const loadComments = createAsyncThunk(
    "app/loadComments",
    async ({ index, permalink }) => {
        const comments = await fetchComments(permalink);
        return { index: index, comments: comments};
    }
);

export const appSlice = createSlice({
    name: "app",
    initialState: {
        posts: [],
        about: [],
        isLoading: false,
        error: false
    },
    reducers: {
        setShowingComments: (state, action) => {
            state.posts[action.payload.index].showingComments = action.payload.showingComments;
        },

        setCommentsNum: (state, action) => {
            state.posts[action.payload.index].commentsNum = action.payload.commentsNum;
        },

        setIsLoadingComments: (state, action) => {
            state.posts[action.payload.index].isLoadingComments = action.payload.isLoadingComments;
        }
    },

    extraReducers: {
        // Load Hot Posts
        [loadPostsHot.pending]: (state, action) => {
            state.isLoading = true;
            state.error = false;
        },

        [loadPostsHot.fulfilled]: (state, action) => {
            state.posts = action.payload;
            state.posts.map((post) => {
                post.showingComments = false;
                post.comments = [];
                post.commentsNum = 3;
                post.isLoadingComments = false;
                return post;
            });
            state.isLoading = false;
        },

        [loadPostsHot.rejected]: (state, action) => {
            state.isLoading = false;
            state.error = true;
        },

        // Load New Posts
        [loadPostsNew.pending]: (state, action) => {
            state.isLoading = true;
            state.error = false;
        },

        [loadPostsNew.fulfilled]: (state, action) => {
            state.posts = action.payload;
            state.posts.map((post) => {
                post.showingComments = false;
                post.comments = [];
                post.commentsNum = 3;
                post.isLoadingComments = false;
                return post;
            });
            state.isLoading = false;
        },

        [loadPostsNew.rejected]: (state, action) => {
            state.isLoading = false;
            state.error = true;
        },

        // Load Top Posts
        [loadPostsTop.pending]: (state, action) => {
            state.isLoading = true;
            state.error = false;
        },

        [loadPostsTop.fulfilled]: (state, action) => {
            state.posts = action.payload;
            state.posts.map((post) => {
                post.showingComments = false;
                post.comments = [];
                post.commentsNum = 3;
                post.isLoadingComments = false;
                return post;
            });
            state.isLoading = false;
        },

        [loadPostsTop.rejected]: (state, action) => {
            state.isLoading = false;
            state.error = true;
        },

        // Load Search Results
        [loadSearchResults.pending]: (state, action) => {
            state.isLoading = true;
            state.error = false;
        },

        [loadSearchResults.fulfilled]: (state, action) => {
            state.posts = action.payload;
            state.posts.map((post) => {
                post.showingComments = false;
                post.comments = [];
                post.commentsNum = 3;
                return post;
            });
            state.isLoading = false;
        },

        [loadSearchResults.rejected]: (state, action) => {
            state.isLoading = false;
            state.error = true;
        },

        // Subreddit About
        [loadSubredditAbout.pending]: (state, action) => {
            state.isLoading = true;
            state.error = false;
        },

        [loadSubredditAbout.fulfilled]: (state, action) => {
            state.about = action.payload;
            state.isLoading = false;
        },

        [loadSubredditAbout.rejected]: (state, action) => {
            state.isLoading = false;
            state.error = true;
        },

        // Load Comments
        [loadComments.pending]: (state, action) => {
            state.posts[action.meta.arg.index].comments = [];
            state.posts[action.meta.arg.index].isLoadingComments = true;

            console.log(state.posts[action.meta.arg.index].isLoadingComments);
        },

        [loadComments.fulfilled]: (state, action) => {
            state.posts[action.payload.index].comments = action.payload.comments;
            state.posts[action.meta.arg.index].isLoadingComments = false;
        },

        [loadComments.rejected]: (state, action) => {
            state.posts[action.meta.arg.index].isLoadingComments = false;
        }
    }
});

export const selectAbout = (state) => state.app.about;
export const selectPosts = (state) => state.app.posts;
export const selectIsLoading = (state) => state.app.isLoading;
export const selectError = (state) => state.app.error;
export const { setShowingComments, setCommentsNum, setIsLoadingComments} = appSlice.actions;
export default appSlice.reducer;
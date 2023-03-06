import React, { useEffect } from "react";
import About from "../About/About";
import Filters from "../Filters/Filters";
import Post from "../Post/Post";
import PostLoading from "../Post/PostLoading";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import { AnimatedList } from "react-animated-list";
import { useDispatch, useSelector } from "react-redux";
import { loadPostsHot, selectPosts, selectIsLoading, selectError } from "../../app/appSlice";
import { loadSubredditAbout } from "../../app/appSlice";
import { setCurrentSubreddit } from "../SubredditsAside/subredditsAsideSlice";
import { setCurrentFilter } from "../Filters/filtersSlice";

const Subreddit = ({ match }) => {
    const dispatch = useDispatch();
    const posts = useSelector(selectPosts);
    const isLoading = useSelector(selectIsLoading);
    const error = useSelector(selectError);
    const currentSubreddit = match.params.id;
    const prefixedSubreddit = "r/" + currentSubreddit;

    useEffect(() => {
        dispatch(setCurrentFilter('hot'));
        dispatch(setCurrentSubreddit(prefixedSubreddit));
        dispatch(loadSubredditAbout(prefixedSubreddit));
        console.log("fetching about sub page");

        dispatch(loadPostsHot(prefixedSubreddit));
    }, [dispatch, prefixedSubreddit]);

    if (error) {
        return (
            <NotFoundPage />
        )
    }

    return (
        <>
            <About />
            <Filters type="subreddit" />
            {isLoading ?
                <AnimatedList>
                    <PostLoading />
                    <PostLoading />
                    <PostLoading />
                </AnimatedList> : posts.map((post, index) => <Post key={index} post={post} postIndex={index} />)}

        </>
    )
};

export default Subreddit;

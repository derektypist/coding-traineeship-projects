import React, { useEffect } from "react";
import Filters from "../Filters/Filters";
import Post from "../Post/Post";
import PostLoading from "../Post/PostLoading";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import AnimatedList from "react-animated-list";
import { useDispatch, useSelector } from "react-redux";
import { loadPostsHot, selectPosts, selectIsLoading, selectError } from "../../app/appSlice";
import { setCurrentSubreddit } from "../SubredditsAside/subredditsAsideSlice";
import { setCurrentFilter } from "../Filters/filtersSlice";

const Home = ({ match }) => {
    const dispatch = useDispatch();
    const posts = useSelector(selectPosts);
    const isLoading = useSelector(selectIsLoading);
    const error = useSelector(selectError);
    const currentSubreddit = match.params.id;

    useEffect(() => {
        dispatch(setCurrentFilter("hot"));
        dispatch(setCurrentSubreddit(""));
        dispatch(loadPostsHot());
    }, [dispatch, currentSubreddit]);

    if (error) {
        return <NotFoundPage />;
    }

    return (
        <>
            <Filters />
            {isLoading ? (
                <AnimatedList>
                    <PostLoading />
                    <PostLoading />
                    <PostLoading />
                </AnimatedList>
            ) : (
                posts.map((post, index) => (
                    <Post key={index} post={post} postIndex={index} />
                ))
            )}
        </>
    );
};

export default Home;
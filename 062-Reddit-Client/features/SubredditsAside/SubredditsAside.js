import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./SubredditsAside.css";
import { useDispatch, useSelector } from "react-redux";
import {
    selectSubredditNames,
    selectIsOpen,
    setIsOpen,
    selectCurrentSubreddit,
    loadSubredditNames,
    selectAsideError
} from "./subredditsAsideSlice";
import Card from "../../components/Card/Card";
import { AiFillHome } from "react-icons/ai";
import { BiSubDirectoryRight } from "react-icons/bi";
import { IoLogoReddit } from "react-icons/io5";

const SubredditsAside = () => {
    const dispatch = useDispatch();
    const subreddits = useSelector(selectSubredditNames);
    const currentSubreddit = useSelector(selectCurrentSubreddit);
    const isOpen = useSelector(selectIsOpen);
    const asideError = useSelector(selectAsideError);

    const toggleSubreddits = () => {
        dispatch(setIsOpen(!isOpen));
    };

    useEffect(() => {
        dispatch(setIsOpen(window.innerWidth > 768));
    }, [dispatch]);

    useEffect(() => {
        if (isOpen) dispatch(loadSubredditNames());
    }, [isOpen, dispatch]);

    const createSubredditButton = (subreddit) => {
        const subredditName = subreddit.display_name_prefixed;
        const subredditIcon = subreddit.icon_img;

        return (
            <Link to={`/${subredditName}`} className={currentSubreddit === subredditName ? "subreddit-link selected" : "subreddit-link"}>
                {subredditIcon ? (<img src={subredditIcon} alt="subreddit avatar" />) : (<IoLogoReddit />)}{subredditName}
            </Link>
        );
    };

    if (asideError) {
        return (
            <Card className="subreddits-card">
                <h3 className="asideErrorMessage">
                    Failed loading subreddits.  <br /> Try refresh
                </h3>
            </Card>
        );
    }

    return (
        <Card className="subreddits-card">
            <ul>
                <li>
                    <ul id="categories-container">
                        <li id="home-link-container">
                            <Link to="/" className={currentSubreddit === "" ? "nav-link-selected" : "nav-link"}>
                                {<AiFillHome />}Home
                            </Link>
                        </li>
                        <li id="subreddits-link-container">
                            <Link to="#" onClick={() => toggleSubreddits()} className={currentSubreddit !== "" && currentSubreddit !== "searchresults" && isOpen ? "nav-link selected" : "nav-link"}>
                                {<BiSubDirectoryRight />}Subreddits
                            </Link>
                        </li>
                    </ul>
                </li>

                {isOpen && (
                    <li>
                        <ul id="subreddits-container">
                            {subreddits.filter((subreddit) => subreddit.display_name_prefixed !== "r/Home").map((subreddit, index) => {
                                return (
                                    <li key={subreddit + index}>
                                        {createSubredditButton(subreddit)}
                                    </li>
                                );
                            })}
                        </ul>
                    </li>
                )}
            </ul>
        </Card>
    );
};

export default SubredditsAside;
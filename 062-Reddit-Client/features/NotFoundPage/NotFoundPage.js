import React, { useEffect } from "react";
import Card from "../../components/Card/Card";
import { Link } from "react-router-dom";
import { setCurrentSubreddit } from "../../features/SubredditsAside/subredditsAsideSlice";
import { useDispatch } from "react-redux";
import { FaSadCry } from "react-icons/fa";
import './NotFoundPage.css';

const NotFoundPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setCurrentSubreddit('404Page'));
    }, [dispatch]);

    return (
        <>
            <Card className="notFoundCard">
                <FaSadCry className="notFoundIcon" />
                <h2 className="notFoundHeading">Something went wrong...</h2>
                <Link to="/" className="nav-link inverted">Start Over</Link>
            </Card>
        </>
    )
};

export default NotFoundPage;
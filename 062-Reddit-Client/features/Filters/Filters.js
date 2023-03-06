import React from 'react';
import './Filters.css';
import { Link } from 'react-router-dom';
import Card from '../../components/Card/Card';
import { useDispatch, useSelector } from 'react-redux';
import { selectFilters, setCurrentFilter, selectCurrentFilter} from './filtersSlice';
import { loadPostsHot, loadPostsNew, loadPostsTop} from '../../app/appSlice';
import { selectCurrentSubreddit } from '../SubredditsAside/subredditsAsideSlice';
import capitalizeFirstLetter from '../../utils/capitalizeFirstLetter';
import { AiFillFire } from "react-icons/ai";
import { GiNewBorn } from "react-icons/gi";
import { FaChartLine } from "react-icons/fa";

const Filters = ( {type}) => {
    const filters = useSelector(selectFilters);
    const currentFilter = useSelector(selectCurrentFilter);
    const currentSubreddit = useSelector(selectCurrentSubreddit);
    const dispatch = useDispatch();

    const icons = {
        hot: <AiFillFire />,
        new: <GiNewBorn />,
        top: <FaChartLine />
    };

    const onClickHandler = (event, filter) => {
        event.preventDefault();
        dispatch(setCurrentFilter(filter));
        switch (filter) {
            case 'hot':
                console.log(filter);
                console.log(currentSubreddit);
                dispatch(loadPostsHot(currentSubreddit));
                break;
            case 'new':
                console.log(filter);
                dispatch(loadPostsNew(currentSubreddit));
                break;
            case 'top':
                console.log(filter);
                dispatch(loadPostsTop(currentSubreddit));
                break;
            default:
                return;
        }
    };

    const createFilterLink = (filter) => {
        return (
            <li key={filter}>
                <Link className={currentFilter === filter ? "nav-link selected" : "nav-link"} to="#" onClick={(event) => {onClickHandler(event,filter)}}>
                    {icons[filter]}
                    {capitalizeFirstLetter(filter)}
                </Link>
            </li>
        )
    };

    return (
        <Card className="filters-card">
            <nav>
                <ul className="filters-list">
                    {filters.map(createFilterLink)}
                </ul>
            </nav>
        </Card>
    )
};

export default Filters;

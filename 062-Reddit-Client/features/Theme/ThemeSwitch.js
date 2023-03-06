import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SliderSwitch from "../../components/SliderSwitch/SliderSwitch";
import { setSavedDarkMode, toggleDarkMode } from "../Theme/themeSlice";
import { selectDarkMode } from "./themeSlice";
import { BiSun } from "react-icons/bi";
import { BiMoon } from "react-icons/bi";

const ThemeSwitch = () => {
    const dispatch = useDispatch();
    const darkMode = useSelector(selectDarkMode);

    useEffect(() => {
        dispatch(setSavedDarkMode());
    }, [dispatch]);

    const handleClick = () => {
        dispatch(toggleDarkMode());
    };

    return (
        <SliderSwitch
            onClick={handleClick}
            icon={!darkMode ? <BiSun /> : <BiMoon />}
            id="theme-switch-input"
        />
    );
};

export default ThemeSwitch;
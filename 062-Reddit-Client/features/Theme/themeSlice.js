import { createSlice } from "@reduxjs.toolkit";

export const themeSlice = createSlice({
    name: "theme",
    initialState: {
        darkMode: false
    },
    reducers: {
        setSavedDarkMode: (state) => {
            const savedSettings = window.localStorage.getItem("redditSettings");
            if (!savedSettings) return;
            let savedDarkMode = JSON.parse(savedSettings).darkMode;
            if (!savedDarkMode) return;
            state.darkMode = savedDarkMode;
        },
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
            window.localStorage.setItem("redditSettings", JSON.stringify({ darkMode: state.darkMode }));
        }
    }
});

export const selectDarkMode = (state) => state.theme.darkMode;
export const { setSavedDarkMode, toggleDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
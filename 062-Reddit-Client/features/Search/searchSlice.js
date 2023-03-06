import { createSlice } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
    name: "search",
    initialState: {
        searchTerm: ""
    },
    reducers: {
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        clearSearchTerm: (state) => {
            state.searchTerm = "";
        }
    }
});

export const selectSearchTerm = (state) => state.search.searchTerm;
export const { setSearchTerm, clearSearchTerm } = searchSlice.actions;
export default searchSlice.reducer;
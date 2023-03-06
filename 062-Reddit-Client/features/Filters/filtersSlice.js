import { createSlice } from '@reduxjs/toolkit';

export const filtersSlice = createSlice({
    name: 'filters',
    initialState: {
        filters: [
            'hot',
            'new',
            'top'
        ],
        currentFilter: 'hot'
    },
    reducers: {
        setCurrentFilter: (state,action) => {
            state.currentFilter = action.payload;
        }
    }
})

export const selectFilters = state => state.filters.filters;
export const selectCurrentFilter = state => state.filters.currentFilter;
export const { setCurrentFilter } = filtersSlice.actions;
export default filtersSlice.reducer;
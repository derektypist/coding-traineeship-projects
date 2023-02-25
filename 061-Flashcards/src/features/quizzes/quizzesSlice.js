import { createSlice } from '@reduxjs/toolkit';
import { addQuizId } from '../topics/topicsSlice';

export const quizzesSlice = createSlice({
  name: 'quizzes',
  initialState: {
    quizzes: {}
  },
  reducers: {
    addQuiz: (state,action) => {
      const newQuiz = {
        id: action.payload.id,
        name: action.payload.name,
        topicId: action.payload.topicId,
        cardIds: action.payload.cardIds
      };
      state.quizzes[action.payload.id] = newQuiz;
    }
  }
});

export const addQuizThunk = (payload) => {
  return (dispatch) => {
    dispatch(addQuiz(payload));
    dispatch(addQuizId({topicId: payload.topicId, id:payload.id}));
  }
};

export const selectQuizzes = state => state.quizzes.quizzes;
export const { addQuiz } = quizzesSlice.actions;
export default quizzesSlice.reducer;
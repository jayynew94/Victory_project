import { createSlice } from '@reduxjs/toolkit'

const transactionsSlice = createSlice({
    name: 'transactions',
    initialState:{
        uploadResult: null,
        reconcileResult: null,
        discrepancies: [],
        loading: false,
        error: null
    },
    reducers:{
        setUploadResult(state,action){
            state.uploadResult = action.payload;
        },
        setReconcileResult(state, action){
            state.reconcileResult = action.payload;
        },
        setDiscrepancies(state, action){
            state.discrepancies = action.payload;
        },
        setLoading(state, action){
            state.loading = action.payload;
        },
        setError(state, action){
            state.error = action.payload;
        }
    }
});

export const {
    setUploadResult,
    setReconcileResult,
    setDiscrepancies,
    setLoading,
    setError
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
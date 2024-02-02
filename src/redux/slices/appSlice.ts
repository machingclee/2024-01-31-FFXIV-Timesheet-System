import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type appSliceState = {
    loading: boolean
}
const initialState: appSliceState = {
    loading: false
}

const appSlice = createSlice(
    {
        name: "auth",
        initialState,
        reducers: {
            setLoading: (state, action: PayloadAction<boolean>) => {
                state.loading = action.payload;
            }
        }
    }
)

export default appSlice
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AppSliceState = {
    loading: boolean,
    dailyTable: {
        loadingDailyId: number,
        loading: boolean
    }
}
const initialState: AppSliceState = {
    loading: false,
    dailyTable: {
        loadingDailyId: 0,
        loading: false
    }
}

const appSlice = createSlice(
    {
        name: "auth",
        initialState,
        reducers: {
            setLoading: (state, action: PayloadAction<boolean>) => {
                state.loading = action.payload;
            },
            setTableLoading: (state, action: PayloadAction<AppSliceState["dailyTable"]>) => {
                state.dailyTable = action.payload;
            }
        }

    }
)

export default appSlice
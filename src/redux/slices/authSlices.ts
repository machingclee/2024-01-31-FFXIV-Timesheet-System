import { getApiClient } from "@/axios/apiClient";
import { MyResponse } from "@/dto/dto";
import { createAsyncThunk, createListenerMiddleware, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { processRes } from "../util/processRes";
import registerEffects from "../util/registerEffects";
import { loadingActions } from "../util/loadingActions";

type AuthSliceState = {
    accessToken: string,
    email: string,
    darkMode: boolean
}
const initialState: AuthSliceState = {
    accessToken: "",
    email: "",
    darkMode: true
}


const authSlice = createSlice(
    {
        name: "auth",
        initialState,
        reducers: {
            setDarkMode: (state, action: PayloadAction<boolean>) => {
                state.darkMode = action.payload;
            },
            setEmail: (state, action: PayloadAction<string>) => {
                state.email = action.payload;
            },
            setToken: (state, action: PayloadAction<string>) => {
                state.accessToken = action.payload;
            },
            reset: (state) => {
                return initialState
            }
        },
        // extraReducers: (builder) => {
        //     builder.addCase(someThunkAction.fetchSth.fulfilled, (state, action) => {

        //     })
        // }
    }
)

export class AuthThunkAction {
    public static googleLogin = createAsyncThunk(
        "timetable/getEvents",
        async (_: undefined, api) => {
            const apiClient = getApiClient();
            const res = await apiClient.get<MyResponse<{ url: string }>>("/auth/login");
            return processRes(res, api);
        }
    );
}

export const authMiddleware = createListenerMiddleware();
registerEffects(authMiddleware, [
    ...loadingActions(AuthThunkAction.googleLogin),
    {
        rejections: [
            AuthThunkAction.googleLogin.rejected
        ]
    }
])

export default authSlice;
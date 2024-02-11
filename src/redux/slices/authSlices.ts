import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

// class AuthThunkAction {
//     public static
// }

export default authSlice;
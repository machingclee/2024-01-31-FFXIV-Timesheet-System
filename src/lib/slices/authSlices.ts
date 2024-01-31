import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthSliceState = {
    accessToken: string,
    email: string,
}
const initialState: AuthSliceState = {
    accessToken: "",
    email: "",
}


const authSlice = createSlice(
    {
        name: "auth",
        initialState,
        reducers: {
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
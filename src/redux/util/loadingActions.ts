import { AsyncThunk } from "@reduxjs/toolkit";
import appSlice from "../slices/appSlice";

export const loadingActions = (thunkAction: any) => {
    return [
        {
            action: thunkAction.pending,
            effect: (action: any, api: any) => {
                api.dispatch(appSlice.actions.setLoading(true));
            }
        },
        {
            action: thunkAction.fulfilled,
            effect: (action: any, api: any) => {
                api.dispatch(appSlice.actions.setLoading(false));
            }
        },
        {
            action: thunkAction.rejected,
            effect: (action: any, api: any) => {
                api.dispatch(appSlice.actions.setLoading(false));
            }
        }
    ]
}
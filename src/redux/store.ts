import { configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import authSlice from './slices/authSlices';
import appSlice from './slices/appSlice';
import timetableSlice, { timetableMiddleware } from './slices/timesheetSlice';

const authPersistConfig = {
    key: "auth",
    timeout: 100,
    storage,
    stateReconciler: autoMergeLevel2,
};

export const makeStore = () => {
    return configureStore({
        reducer: {
            auth: persistReducer<ReturnType<typeof authSlice.reducer>>(authPersistConfig, authSlice.reducer),
            app: appSlice.reducer,
            timetable: timetableSlice.reducer
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false
            }).concat(
                timetableMiddleware.middleware,
            )
    });
}




// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
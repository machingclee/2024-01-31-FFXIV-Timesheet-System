import { CheckUpdate, CreateTimeSlotParam, Day, Event, MyResponse, TimeSheetsWeeklyProps, UpsertMessageParam, UpsertParticipantParam } from "@/dto/dto";
import { createAsyncThunk, createListenerMiddleware, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";
import registerEffects from "../util/registerEffects";
import { getApiClient } from "@/axios/apiClient";
import { processRes } from "../util/processRes";
import { loadingActions } from "../util/loadingActions";
import { v4 as uuidv4 } from "uuid";
import normalize from "@/util/normalize";

export type TimetableSliceState = {
    events: Event[],
    selectedWeek: {
        title: string,
        weeklyId: string,
        days: {
            ids?: string[]
            idToObject?: { [id: string]: Day }
        }
    }
}

const initialState: TimetableSliceState = {
    events: [],
    selectedWeek: {
        title: "",
        weeklyId: "",
        days: {}
    }
}

const timetableSlice = createSlice(
    {
        name: "timetable",
        initialState,
        reducers: {
            addParticipantLocal: (state, action: PayloadAction<{ userUUID: string, dailyId: number }>) => {
                const { dailyId, userUUID } = action.payload;
                const day = state.selectedWeek.days.idToObject?.[dailyId];
                if (!day) {
                    return;
                }
                day.participants.push({
                    frontendUUID: userUUID,
                    message: "",
                    selections: [],
                    username: "",
                })
            },
            batchChecksUpdate: (state, action: PayloadAction<{
                checks: CheckUpdate[]
            }>) => {
                const { checks } = action.payload;
                for (const checkUpdate of checks) {
                    const { checked, optionId, timeslotDailyId, userUUID } = checkUpdate;
                    const day = state.selectedWeek.days.idToObject?.[timeslotDailyId];
                    if (!day) {
                        return;
                    }
                    const user = day.participants.find(p => p.frontendUUID === userUUID);
                    if (!user) {
                        return;
                    }
                    const selection = user.selections.find(s => s.timeAvailableOptionId === optionId);
                    if (selection) {
                        selection.checked = checked;
                    } else {
                        user.selections.push({
                            checked,
                            timeAvailableOptionId: optionId,
                        })
                    }
                }
            },
            reset: () => initialState
        },
        extraReducers(builder) {
            builder
                .addCase(TimetableThunkActions.getEvents.fulfilled, (state, action) => {
                    const result = action.payload;
                    state.events = result!.events;
                })
                .addCase(TimetableThunkActions.selectEvent.fulfilled, (state, action) => {
                    const { days, title, weeklyId } = action.payload;
                    const { idToObject, ids } = normalize({ idAttribute: "dailyId", targetArr: days })
                    state.selectedWeek.days = { ids, idToObject };
                    state.selectedWeek.title = title;
                    state.selectedWeek.weeklyId = weeklyId;
                })
                .addCase(TimetableThunkActions.getTimesheetDaily.fulfilled, (state, action) => {
                    const { timeslot: day } = action.payload;
                    if (state.selectedWeek.days.idToObject?.[day.dailyId]) {
                        state.selectedWeek.days.idToObject[day.dailyId] = day;
                    }
                })
                .addCase(TimetableThunkActions.deleteParticipant.fulfilled, (state, action) => {
                    const { userUuid, dailyId } = action.payload;
                    const day = state.selectedWeek.days.idToObject?.[dailyId];
                    if (day) {
                        day.participants = day.participants.filter(u => u.frontendUUID !== userUuid);
                    }
                })
        },
    }
)

export class TimetableThunkActions {
    public static updateMessage = createAsyncThunk(
        "timetable/updateMessage",
        async (params: { msgUpdate: UpsertMessageParam, dailyId: number }, api) => {
            const apiClient = getApiClient();
            const res = await apiClient.post("/timesheet/upsert-message", params.msgUpdate);
            if (!res.data.success) {
                return api.rejectWithValue(JSON.stringify(res.data.errorMessage));
            } else {
                const { dailyId } = params;
                return { dailyId }
            }
        }
    );
    public static updateChecks = createAsyncThunk(
        "timetable/updateChecks",
        async (params: { checks: CheckUpdate[] }, api) => {
            const { checks } = params;
            const apiClient = getApiClient();
            const res = await apiClient.post<MyResponse<undefined>>(
                "/timesheet/make-selection",
                { selections: checks }
            );
            return processRes(res, api);
        }
    );
    public static getTimesheetDaily = createAsyncThunk(
        "timetable/getTimesheetDaily",
        async (params: { dailyId: number }, api) => {
            const { dailyId } = params;
            const apiClient = getApiClient();
            const res = await apiClient.get<MyResponse<{ timeslot: Day }>>(
                `/timesheet/get-event-specfic-timeslot/${dailyId}`
            )
            return processRes(res, api);
        }
    );
    public static selectEvent = createAsyncThunk(
        "timetable/selectEvent",
        async (params: { weeklyId: string }, api) => {
            const { weeklyId } = params;
            const apiClient = getApiClient();
            const res = await apiClient.get<MyResponse<TimeSheetsWeeklyProps>>(
                `/timesheet/get-event-timeslot/${weeklyId}`
            );
            return processRes(res, api);
        }
    );
    public static getEvents = createAsyncThunk(
        "timetable/getEvents",
        async (_: undefined, api) => {
            const apiClient = getApiClient();
            const res = await apiClient.get<MyResponse<{ events: Event[] }>>(
                "/timesheet/get-events"
            );
            return processRes(res, api);
        }
    );
    public static createWeekly = createAsyncThunk(
        "timetable/createWeekly",
        async (param: CreateTimeSlotParam, api) => {
            const apiClient = getApiClient();
            const res = await apiClient.post<MyResponse<undefined>>(
                "/timesheet/create-timeslot",
                param
            );
            return processRes(res, api);
        }
    );
    public static deleteWeekly = createAsyncThunk(
        "timetable/deleteWeekly",
        async (param: { weeklyId: string }, api) => {
            const { weeklyId } = param;
            const apiClient = getApiClient();
            const res = await apiClient.delete<MyResponse<undefined>>(
                `/timesheet/delete-weekly/${weeklyId}`,
            );
            return processRes(res, api);
        }
    );
    public static updateWeekly = createAsyncThunk(
        "timetable/updateWeekly",
        async (param: { weeklyId: string, title: string }, api) => {
            const { weeklyId, title } = param;
            const apiClient = getApiClient();
            const res = await apiClient.put(
                `/timesheet/edit-weekly/${weeklyId}`,
                { title }
            );
            return processRes(res, api);
        }
    );
    public static deleteParticipant = createAsyncThunk(
        "timetable/deleteParticipant",
        async (param: { dailyId: number, userUuid: string }, api) => {
            const { dailyId, userUuid } = param;
            const apiClient = getApiClient();
            const res = await apiClient.delete(`/timesheet/delete-participant/${userUuid}`);
            if (!res.data.success) {
                return api.rejectWithValue(JSON.stringify(res.data.errorMessage));
            } else {
                return { dailyId, userUuid }
            }
        }
    );
    public static upsertParticipant = createAsyncThunk(
        "timetable/upsertParticipant",
        async (params: UpsertParticipantParam, api) => {
            const { userUUID, dailyId } = params;
            const apiClient = getApiClient();
            const res = await apiClient.post("/timesheet/upsert-participant", params);
            if (!res.data.success) {
                return api.rejectWithValue(JSON.stringify(res.data.errorMessage));
            } else {
                return { userUUID, dailyId }
            }
        }
    );
}

export const timetableMiddleware = createListenerMiddleware();
registerEffects(timetableMiddleware, [
    ...loadingActions(TimetableThunkActions.getEvents),
    ...loadingActions(TimetableThunkActions.createWeekly),
    ...loadingActions(TimetableThunkActions.deleteWeekly),
    ...loadingActions(TimetableThunkActions.updateWeekly),
    ...loadingActions(TimetableThunkActions.getTimesheetDaily),
    ...loadingActions(TimetableThunkActions.updateMessage),
    {
        action: TimetableThunkActions.createWeekly.fulfilled,
        effect: (action, api) => {
            api.dispatch(TimetableThunkActions.getEvents());
        }
    },
    {
        action: TimetableThunkActions.deleteWeekly.fulfilled,
        effect: (action, api) => {
            api.dispatch(TimetableThunkActions.getEvents());
        }
    },
    {
        action: TimetableThunkActions.updateWeekly.fulfilled,
        effect: (action, api) => {
            api.dispatch(TimetableThunkActions.getEvents());
        }
    },
    {
        action: TimetableThunkActions.updateMessage.fulfilled,
        effect: (action, api) => {
            const { dailyId } = (action as ReturnType<typeof TimetableThunkActions.updateMessage.fulfilled>).payload;
            api.dispatch(TimetableThunkActions.getTimesheetDaily({ dailyId }));
        }
    }
])

export default timetableSlice
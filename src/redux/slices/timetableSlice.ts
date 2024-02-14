import { CheckUpdate, CreateTimeSlotParam, Day, Event, MyResponse, TimeSheetsWeeklyProps, TimesheetOption, UpdateOptionEnabled, UpsertMessageParam, UpsertParticipantParam } from "@/dto/dto";
import { createAsyncThunk, createListenerMiddleware, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";
import registerEffects from "../util/registerEffects";
import { getApiClient } from "@/axios/apiClient";
import { processRes } from "../util/processRes";
import { loadingActions } from "../util/loadingActions";
import { v4 as uuidv4 } from "uuid";
import normalize from "@/util/normalize";
import Cache from "@/util/Cache";

export type TimetableSliceState = {
    events: Event[],
    timerange: {
        rerenderFlag: boolean,
        options: TimesheetOption[][]
    },
    selectedWeek: {
        title: string,
        weeklyId: string,
        days: {
            ids?: number[]
            idToObject?: { [id: number]: Day }
        }
    }
}

const initialState: TimetableSliceState = {
    events: [],
    timerange: {
        rerenderFlag: true,
        options: [],
    },
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
            setTimerangeRerenderFlag: (state, action: PayloadAction<boolean>) => {
                state.timerange.rerenderFlag = action.payload;
            },
            duplicateTimeRangeOfFirstDay: (state) => {
                const dayOneOptions = state.timerange.options?.[0]
                const dayOneIds = dayOneOptions.map(opt => opt.id);
                for (const [optionId, enabled] of Cache.enableList) {
                    if (dayOneIds.includes(optionId)) {
                        const target = dayOneOptions.find(opt => opt.id === optionId);
                        target!.enabled = enabled;
                    }
                }
                state.timerange.options.forEach(opts => {
                    for (const i in opts) {
                        opts[i].enabled = dayOneOptions[i].enabled;
                        Cache.enableList.set(opts[i].id, dayOneOptions[i].enabled);
                    }
                })
            },
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
                .addCase(TimesheetThunkActions.getEvents.fulfilled, (state, action) => {
                    const result = action.payload;
                    state.events = result!.events;
                })
                .addCase(TimesheetThunkActions.getWeeklyTimetables.fulfilled, (state, action) => {
                    const { days, title, weeklyId } = action.payload;
                    const { idToObject, ids } = normalize<Day, number>({ idAttribute: "dailyId", targetArr: days })
                    state.selectedWeek.days = { ids, idToObject };
                    state.selectedWeek.title = title;
                    state.selectedWeek.weeklyId = weeklyId;
                })
                .addCase(TimesheetThunkActions.getTimesheetDaily.fulfilled, (state, action) => {
                    const { timeslot: day } = action.payload;
                    if (state.selectedWeek.days.idToObject?.[day.dailyId]) {
                        state.selectedWeek.days.idToObject[day.dailyId] = day;
                    }
                })
                .addCase(TimesheetThunkActions.deleteParticipant.fulfilled, (state, action) => {
                    const { userUuid, dailyId } = action.payload;
                    const day = state.selectedWeek.days.idToObject?.[dailyId];
                    if (day) {
                        day.participants = day.participants.filter(u => u.frontendUUID !== userUuid);
                    }
                })
                .addCase(TimesheetThunkActions.getTimeOptionsWeekly.fulfilled, (state, action) => {
                    state.timerange.options = action.payload.map(u => u.options);
                })
        }
    }
)

export class TimesheetThunkActions {
    public static updateEnabledTimeslot = createAsyncThunk(
        "timetable/updateEnabledTimeslot",
        async (params: UpdateOptionEnabled[], api) => {
            const apiClient = getApiClient();
            const res = await apiClient.put<MyResponse<undefined>>(`/timesheet/options/weekly`, params);
            return processRes(res, api);
        }
    );
    public static getTimeOptionsWeekly = createAsyncThunk(
        "timetable/getTimeOptionsWeekly",
        async (params: { weeklyId: string }, api) => {
            const apiClient = getApiClient();
            const { weeklyId } = params;

            const res = await apiClient.get<MyResponse<{
                options: TimesheetOption[]
            }[]>>(`/timesheet/options/${weeklyId}`);

            return processRes(res, api);
        }
    );
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
    public static getWeeklyTimetables = createAsyncThunk(
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
    ...loadingActions(TimesheetThunkActions.getEvents),
    ...loadingActions(TimesheetThunkActions.getWeeklyTimetables),
    ...loadingActions(TimesheetThunkActions.createWeekly),
    ...loadingActions(TimesheetThunkActions.deleteWeekly),
    ...loadingActions(TimesheetThunkActions.updateWeekly),
    ...loadingActions(TimesheetThunkActions.getTimesheetDaily),
    ...loadingActions(TimesheetThunkActions.updateMessage),
    ...loadingActions(TimesheetThunkActions.updateEnabledTimeslot),
    ...loadingActions(TimesheetThunkActions.getTimeOptionsWeekly),
    {
        action: TimesheetThunkActions.createWeekly.fulfilled,
        effect: (action, api) => {
            api.dispatch(TimesheetThunkActions.getEvents());
        }
    },
    {
        action: TimesheetThunkActions.deleteWeekly.fulfilled,
        effect: (action, api) => {
            api.dispatch(TimesheetThunkActions.getEvents());
        }
    },
    {
        action: TimesheetThunkActions.updateWeekly.fulfilled,
        effect: (action, api) => {
            api.dispatch(TimesheetThunkActions.getEvents());
        }
    },
    {
        action: TimesheetThunkActions.updateMessage.fulfilled,
        effect: (action, api) => {
            const { dailyId } = (action as ReturnType<typeof TimesheetThunkActions.updateMessage.fulfilled>).payload;
            api.dispatch(TimesheetThunkActions.getTimesheetDaily({ dailyId }));
        }
    }
])

export default timetableSlice
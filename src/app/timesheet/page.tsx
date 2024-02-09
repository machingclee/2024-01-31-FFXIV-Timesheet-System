"use client";

import Spacer from "@/component/Spacer";
import AddTimeSlot from "../component/AddTimeSlot";
import Events from "./component/Events";
import { useEffect, useState } from "react";
import { Event } from "@/dto/dto";
import useApiClient from "@/hooks/useApiClient";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import appSlice from "@/redux/slices/appSlice";
import UsageGuide from "./component/UsageGuide";

export default () => {
    const apiClient = useApiClient();
    const dispatch = useAppDispatch();
    const [weeklyEvents, setWeeklyEvents] = useState<Event[]>([])
    const accessToken = useAppSelector(s => s.auth.accessToken);
    const getWeeklyEvents = () => {
        dispatch(appSlice.actions.setLoading(true));
        apiClient.get<{ result: { events: Event[] } }>("/timesheet/get-events").then((res) => {
            const events_ = res.data.result.events;
            setWeeklyEvents(events_);
        }).finally(() => {
            dispatch(appSlice.actions.setLoading(false));
        })
    }
    useEffect(() => {
        getWeeklyEvents();
    }, [])

    return <>
        <div style={{
            opacity: accessToken ? 1 : 0.3,
            pointerEvents: accessToken ? "auto" : "none"
        }}
        >
            <AddTimeSlot getWeeklyEvents={getWeeklyEvents} />
            <Spacer />
            <Events events={weeklyEvents} getWeeklyEvents={getWeeklyEvents} />

        </div >
        {!accessToken && <UsageGuide />}
    </>
}
"use client";

import Spacer from "@/component/Spacer";
import AddTimeSlot from "../component/AddTimeSlot";
import Events from "./component/Events";
import { useEffect, useRef, useState } from "react";
import { Event } from "@/dto/dto";
import useApiClient from "@/hooks/useApiClient";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import appSlice from "@/redux/slices/appSlice";
import UsageGuide from "./component/UsageGuide";
import { TimesheetThunkActions } from "@/redux/slices/timesheetSlice";
import { getApiClient } from "@/axios/apiClient";

export default () => {
    const apiClient = getApiClient();
    const dispatch = useAppDispatch();
    const weeklyEvents = useAppSelector(s => s.timetable.events);
    const accessToken = useAppSelector(s => s.auth.accessToken);
    const dataFetched = useRef(false);

    useEffect(() => {
        if (!dataFetched.current) {
            dispatch(TimesheetThunkActions.getEvents());
            dataFetched.current = true;
        }
    }, [])

    return <>
        <div style={{
            opacity: accessToken ? 1 : 0.3,
            pointerEvents: accessToken ? "auto" : "none"
        }}
        >
            <AddTimeSlot />
            <Spacer />
            <Events events={weeklyEvents} />
        </div >
    </>
}
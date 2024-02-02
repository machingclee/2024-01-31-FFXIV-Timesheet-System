"use client";

import Spacer from "@/component/Spacer";
import AddTimeSlot from "../component/AddTimeSlot";
import Events from "./component/Events";
import { useEffect, useState } from "react";
import { Event } from "@/dto/dto";
import useApiClient from "@/hooks/useApiClient";
import { useAppSelector } from "@/redux/hooks";

export default () => {
    const apiClient = useApiClient();
    const [events, setEvents] = useState<Event[]>([])
    const accessToken = useAppSelector(s => s.auth.accessToken);
    const getEvents = async () => {
        const res = await apiClient.get<{ result: { events: Event[] } }>("/timesheet/get-events");
        const events_ = res.data.result.events;
        setEvents(events_);
    }
    useEffect(() => {
        getEvents();
    }, [])

    return <>
        <div style={{
            opacity: accessToken ? 1 : 0.3,
            pointerEvents: accessToken ? "auto" : "none"
        }}
        >
            <AddTimeSlot getEvents={getEvents} />
            <Spacer />
            <Events events={events} />
        </div >
    </>
}
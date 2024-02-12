"use client";

import useParams from "@/hooks/useParams";
import TimeSheetsWeekly from "./component/TimeSheetsWeekly";
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import timetableSlice from "@/redux/slices/timetableSlice";

export default () => {
    const params = useParams<{ weeklyId: string }>();
    const weeklyId = params.get("weeklyId");
    const dispatch = useAppDispatch();
    useEffect(() => {
        return () => {
            dispatch(timetableSlice.actions.reset());
        }
    }, [])

    return (
        <div>
            <TimeSheetsWeekly weeklyId={weeklyId || ""} />
        </div>
    )

}
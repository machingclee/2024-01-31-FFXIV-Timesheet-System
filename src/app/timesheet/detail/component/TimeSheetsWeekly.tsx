import { TimeSheetsWeeklyProps as TimeSheetsWeeklyProps } from "@/dto/dto";
import useApiClient from "@/hooks/useApiClient";
import { useEffect, useState } from "react";
import Spacer from "@/component/Spacer";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import appSlice from "@/redux/slices/appSlice";
import TimeSheetDaily from "../../component/TimeSheetDaily";


export default ({ weeklyId }: { weeklyId: string }) => {
    const [timeslot, setTimeslot] = useState<TimeSheetsWeeklyProps | null>(null);
    const dispatch = useAppDispatch();
    const apiClient = useApiClient();
    useEffect(() => {
        if (!weeklyId) {
            return;
        }
        dispatch(appSlice.actions.setLoading(true));
        apiClient
            .get<{ result: { timeslots: TimeSheetsWeeklyProps } }>(`/timesheet/get-event-timeslot/${weeklyId}`)
            .then(res => { setTimeslot(res.data.result.timeslots) })
            .finally(() => {
                dispatch(appSlice.actions.setLoading(false));
            })
    }, [weeklyId])

    return (
        <>
            <div style={{ fontSize: 26, fontWeight: 600 }}>{timeslot?.title}</div>
            <Spacer />
            <div key={timeslot?.weeklyId || ""}>
                <TimeSheetWeekly timeSheets={timeslot} />
            </div>
            <Spacer height={200} />
        </>
    )
}

const TimeSheetWeekly = ({ timeSheets }: { timeSheets: TimeSheetsWeeklyProps | null }) => {
    if (!timeSheets) {
        return null;
    }
    const { days, weeklyId } = timeSheets;
    return (
        <div>
            {days.map(day => {
                const { dailyId } = day;
                return (
                    <TimeSheetDaily key={dailyId} day={day} />
                )
            })}
        </div>
    )
}

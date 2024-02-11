import { TimeSheetsWeeklyProps as TimeSheetsWeeklyProps } from "@/dto/dto";
import useApiClient from "@/hooks/useApiClient";
import { useEffect, useState } from "react";
import Spacer from "@/component/Spacer";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import appSlice from "@/redux/slices/appSlice";
import TimeSheetDaily from "../../component/TimeSheetDaily";
import { BsDiamondFill } from "react-icons/bs";

const Ruler = ({ height = 1, color = "rgba(255,255,255,0.4)" }: { height?: number, color?: string }) => {
    return <div style={{ height, backgroundColor: color, width: "100%" }}></div>
}

const HeaderSeparator = () => {
    return (
        <div style={{ display: "flex", alignItems: "center" }} className="title-separator">
            <div style={{ flex: 1, display: "flex", alignItems: "center" }} className="ruler">
                <Ruler height={2} />
            </div>
            <div style={{ display: "flex", alignItems: "center", paddingLeft: 30, paddingRight: 30 }} >
                <BsDiamondFill color="rgba(255,255,255,0.4)" />
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center" }} className="ruler">
                <Ruler height={2} />
            </div>
        </div >
    )
}


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
            <div style={{
                fontSize: 30,
                fontWeight: 600,
                display: "flex",
                justifyContent: "center"
            }}>
                {timeslot?.title}
            </div>
            <Spacer />
            <HeaderSeparator />
            <Spacer />
            <Spacer width={20} />
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

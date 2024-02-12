import { TimeSheetsWeeklyProps as TimeSheetsWeeklyProps } from "@/dto/dto";
import useApiClient from "@/hooks/useApiClient";
import { useEffect, useState } from "react";
import Spacer from "@/component/Spacer";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import appSlice from "@/redux/slices/appSlice";
import TimeSheetDaily from "../../component/TimeSheetDaily";
import { BsDiamondFill } from "react-icons/bs";
import { TimetableSliceState, TimetableThunkActions } from "@/redux/slices/timetableSlice";

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
    const { days, title } = useAppSelector(s => s.timetable.selectedWeek)
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (!weeklyId) {
            return;
        }
        dispatch(TimetableThunkActions.selectEvent({ weeklyId }))
    }, [weeklyId])

    return (
        <>
            <div style={{
                fontSize: 30,
                fontWeight: 600,
                display: "flex",
                justifyContent: "center"
            }}>
                {title}
            </div>
            <Spacer />
            <HeaderSeparator />
            <Spacer />
            <Spacer width={20} />
            <div key={weeklyId || ""}>
                <TimeSheetWeekly days={days} />
            </div>
            <Spacer height={200} />
        </>
    )
}

const TimeSheetWeekly = ({ days }: { days: TimetableSliceState["selectedWeek"]["days"] }) => {
    if (!days) {
        return null;
    }
    return (
        <div>
            {days.ids?.map(dailyId => {
                const day = days.idToObject?.[dailyId];
                return (
                    <TimeSheetDaily key={dailyId} day={day!} />
                )
            })}
        </div>
    )
}

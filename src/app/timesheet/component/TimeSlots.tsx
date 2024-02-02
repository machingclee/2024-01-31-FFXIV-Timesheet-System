import { TimeSlot } from "@/dto/dto";
import useApiClient from "@/hooks/useApiClient";
import { useEffect, useState } from "react";
import { tss } from "tss-react";
import xdayjs from "../../../util/xdayjs"
import MyButton from "@/component/MyButton";
import Spacer from "@/component/Spacer";
import { useAppDispatch } from "@/redux/hooks";
import appSlice from "@/redux/slices/appSlice";

export default ({ weeklyId }: { weeklyId: string }) => {
    const [timeslots, setTimeslots] = useState<TimeSlot[]>([]);
    const dispatch = useAppDispatch();
    const apiClient = useApiClient();
    useEffect(() => {
        if (!weeklyId) {
            return;
        }
        dispatch(appSlice.actions.setLoading(true));
        apiClient
            .get<{ result: { timeslots: TimeSlot[] } }>(`/timesheet/get-event-timeslot/${weeklyId}`)
            .then(res => { setTimeslots(res.data.result.timeslots) })
            .finally(() => {
                dispatch(appSlice.actions.setLoading(false));
            })
    }, [weeklyId])

    return (
        <>
            {timeslots.map(timeslot => {
                return (
                    <div key={timeslot.weeklyId}>
                        <Slot slot={timeslot} />
                    </div>
                )
            })}
        </>
    )
}

const Slot = ({ slot }: { slot: TimeSlot }) => {
    const { classes, cx } = useStyles();
    const { days, weeklyId } = slot;
    return (
        <div>
            {days.map(day => {
                const startingDayjs = xdayjs(day.options?.[0].option);
                const startingDate = startingDayjs.format("YYYY-MM-DD");
                const weekDay = startingDayjs.format("dddd");
                return (
                    <div key={day.orderWithinWeek}>
                        <div>{startingDate} ({weekDay})</div>
                        <Spacer height={10} />
                        <MyButton>Add Participant</MyButton>
                        <Spacer height={10} />
                        <table className={cx(classes.table)}>
                            <tbody>
                                {day.options.map(opt => {
                                    const { id, option, timeslotDailyId } = opt;
                                    const from = xdayjs(option).format("HH:mm")
                                    const to = xdayjs(option).add(1, "hour").format("HH:mm")
                                    return (
                                        <tr key={id}>
                                            <td>{from}</td>
                                            <td> - </td>
                                            <td>{to}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        <Spacer />
                    </div>
                )
            })}
        </div>
    )
}


const useStyles = tss.create(() => ({
    table: {
        "& tr:nth-child(2n+1)": {
            backgroundColor: "rgba(0,0,0,0.1)"
        }
    }
}))
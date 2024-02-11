import { Participant, CheckUpdate, UpsertParticipantParam, Day } from "@/dto/dto";
import useApiClient from "@/hooks/useApiClient";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import xdayjs from "@/util/xdayjs";
import { debounce, cloneDeep } from "lodash";
import { useState, useEffect, PropsWithChildren, HTMLAttributes } from "react";
import appSlice from "../../../../appSlice";
import useTimesheetStyles from "./styles/useTimesheetStyles";
import { v4 as uuidv4 } from "uuid";
import Spacer from "@/component/Spacer";
import { CircularProgress, Fab, Switch } from "@mui/material";
import boxShadow from "@/constants/boxShadow";
import OptionsColumn from "./OptionsColumn";
import AddIcon from '@mui/icons-material/Add';
import constants from "@/constants/constants";
import { TEXT_COLOR } from "@/component/Body";
import Weekday from "@/component/WeekDay";

export default (props: {
    day: Day,
}) => {
    const { loading, loadingDailyId: loadingId } = useAppSelector(s => s.app.dailyTable);
    const [successSelectionIds, setSuccessSelectionIds] = useState<number[]>([]);
    const { day } = props;
    const { dailyId } = day;
    const showSpinner = (dailyId === loadingId) && loading;
    const startingDayjs = xdayjs(day.options?.[0].option);
    const startingDate = startingDayjs.format("YYYY-MM-DD");
    const weekDay = startingDayjs.format("dddd");
    const [turnOnFilter, setTurnOnfilter] = useState(false);
    const { classes, cx } = useTimesheetStyles();
    const [particiants, setParticipants] = useState<Participant[]>([]);
    const dispatch = useAppDispatch();
    const apiClient = useApiClient();
    const checksUpdate = (checks: CheckUpdate[]) => {
        dispatch(appSlice.actions.setTableLoading({ loading: true, loadingDailyId: dailyId }))
        apiClient.post(
            "/timesheet/make-selection",
            { selections: checks }
        ).finally(() => {
            dispatch(appSlice.actions.setTableLoading({ loading: false, loadingDailyId: 0 }))
        })
    }
    const upsertParticipant_ = (params: UpsertParticipantParam) => {
        apiClient.post("/timesheet/upsert-participant", params);
    }

    const upsertParticipant = debounce(upsertParticipant_, 500)

    const addUser = () => {
        const userUUID = uuidv4();
        setTurnOnfilter(false);
        upsertParticipant({
            dailyId,
            username: "",
            userUUID,
        })
        setParticipants(ps => {
            const newPs = cloneDeep(ps);
            newPs.push({
                frontendUUID: userUUID,
                message: "",
                selections: [],
                username: "",
            })
            return newPs;
        })
    }
    const getFinalResultCount = (day: Day) => {
        const selectionIdToCount = new Map<number, number>();
        day.participants.forEach(p => {
            const { selections } = p;
            selections.filter(s => s.checked).forEach(s => {
                const selectionId = s.timeAvailableOptionId;
                const count = selectionIdToCount.get(selectionId);
                if (typeof count === "undefined") {
                    selectionIdToCount.set(selectionId, 1);
                } else {
                    selectionIdToCount.set(selectionId, count + 1);
                }
            })
        })
        return selectionIdToCount;
    }

    const refreshParticipants = async () => {
        dispatch(appSlice.actions.setLoading(true));
        const res = await apiClient.get<{ result: { timeslot: Day } }>(
            `/timesheet/get-event-specfic-timeslot/${dailyId}`
        )
        dispatch(appSlice.actions.setLoading(false));
        const day_ = res.data.result.timeslot;
        setParticipants(day_.participants);
    }

    useEffect(() => {
        if (turnOnFilter) {
            apiClient.get<{ result: { timeslot: Day } }>(
                `/timesheet/get-event-specfic-timeslot/${dailyId}`
            ).then(res => {
                const day_ = res.data.result.timeslot;
                const numOfParticipants = day_.participants.length;
                const selectionIdToCount = getFinalResultCount(day_);
                const ids: number[] = [];
                for (const [selectionId, count] of selectionIdToCount) {
                    if (count === numOfParticipants) {
                        ids.push(selectionId);
                    }
                }
                setSuccessSelectionIds(ids);
            })
        } else {
            setSuccessSelectionIds([]);
        }
    }, [turnOnFilter])

    useEffect(() => {
        setParticipants(day.participants);
    }, [day])

    return (
        <>
            <div style={{
                boxShadow: boxShadow.SHADOW_58,
                borderRadius: 10,
                overflow: "hidden"
            }}
                className={cx(classes.table, "timesheet")}
            >

                <div style={{
                    height: 50,
                    display: "flex",
                    backgroundColor: "rgba(0,0,0,0.45)",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <HPadding style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <div style={{ display: "flex", }}>
                            <div style={{
                                // backgroundColor: "rgba(0,0,0,0.4)",
                                color: TEXT_COLOR,
                                fontWeight: 600,
                                fontSize: 16,
                                display: "flex",
                                alignItems: "center"
                            }}>
                                {startingDate}
                                <Spacer />
                                <Weekday>
                                    {weekDay}
                                </Weekday>
                            </div>

                            {showSpinner && <CircularProgress size={20} />}
                        </div>


                        <div >
                            <span style={{ opacity: turnOnFilter ? 0.8 : 0.4, fontSize: 14 }}>
                                Highlight Available:
                            </span>  <Switch onChange={(e) => { setTurnOnfilter(e.target.checked) }} />
                        </div>

                    </HPadding>
                </div>

                <HPadding>
                    <div style={{ display: "flex" }}>
                        <table className={cx(classes.firstColumn, "timecolumn")}>
                            <tbody>
                                <tr><td style={{ textAlign: "right", height: 31 }} colSpan={3}></td></tr>
                                <tr><td style={{ textAlign: "right", height: 23 }} colSpan={3}></td></tr>
                                {day.options.map(opt => {
                                    const { id, option } = opt;
                                    const from = xdayjs(option).format("hh:mm a")
                                    const to = xdayjs(option).add(1, "hour").format("hh:mm a")
                                    return (
                                        <tr key={id}>
                                            <td style={{ textAlign: "right", width: 55, minWidth: 55, textOverflow: "ellipsis" }}>{from}</td>
                                            <td style={{ textAlign: "center", width: 10, textOverflow: "ellipsis" }}> - </td>
                                            <td style={{ textAlign: "left", width: 55, minWidth: 55, textOverflow: "ellipsis" }}>{to}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>


                        {particiants.map(user => {
                            const { frontendUUID, username, message } = user;
                            return (
                                <OptionsColumn
                                    refreshParticipants={refreshParticipants}
                                    participantMessage={message}
                                    successSelectionIds={successSelectionIds}
                                    key={frontendUUID}
                                    username={username}
                                    dailyId={dailyId}
                                    options={day.options}
                                    uuid={frontendUUID}
                                    checksUpdate={checksUpdate}
                                    upsertParticipant={upsertParticipant}
                                    setParticipants={setParticipants}
                                    selections={user.selections}
                                />
                            )
                        })}
                        <Spacer width={30} />
                        <Fab style={{ backgroundColor: "rgba(0,0,0,0.3)", width: 36, height: 36, marginTop: 10 }} onClick={addUser}>
                            <AddIcon style={{ color: "white" }} />
                        </Fab>
                    </div>
                </HPadding>
                <Spacer height={10} />
            </div>
            <Spacer />
            <Spacer />
        </ >
    )
}

const HPadding = ({ children, style, ...props }: HTMLAttributes<HTMLDivElement>) => {
    return (
        <div style={{ paddingLeft: 10, paddingRight: 10, ...style }}{...props}>{children}</div>
    )
}
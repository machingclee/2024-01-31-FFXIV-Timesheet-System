import { Participant, CheckUpdate, UpsertParticipantParam, Day as string, Day } from "@/dto/dto";
import useApiClient from "@/hooks/useApiClient";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import xdayjs from "@/util/xdayjs";
import { debounce, cloneDeep } from "lodash";
import { useState, useEffect, PropsWithChildren, HTMLAttributes, useMemo } from "react";
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
import timetableSlice, { TimesheetThunkActions } from "@/redux/slices/timetableSlice";
import { FaArrowRightLong } from "react-icons/fa6";

const SelectionLoadingSpinner = (props: { dailyId: number }) => {
    const { dailyId } = props;
    const { loading, loadingDailyId: loadingId } = useAppSelector(s => s.app.dailyTable);
    const showSpinner = (dailyId === loadingId) && loading;
    return <>{showSpinner && <CircularProgress size={20} />}</>
}


export default (props: { dailyId: number }) => {
    const { dailyId } = props;
    const day: Day | undefined = useAppSelector(s => s.timetable.selectedWeek.days.idToObject?.[dailyId]);
    const [successSelectionIds, setSuccessSelectionIds] = useState<number[]>([]);
    const startTime = day?.options?.[0]?.option;
    const startingDayjs = xdayjs(day?.options?.[0]?.option);
    const startingDate = startingDayjs.format("YYYY-MM-DD");
    const weekDay = startingDayjs.format("dddd");
    const [turnOnFilter, setTurnOnfilter] = useState(true);
    const { classes, cx } = useTimesheetStyles();
    const dispatch = useAppDispatch();
    const checksUpdate = (checks: CheckUpdate[]) => {
        dispatch(appSlice.actions.setTableLoading({ loading: true, loadingDailyId: dailyId }))
        dispatch(TimesheetThunkActions.updateChecks({ checks }))
            .unwrap()
            .finally(() => {
                dispatch(appSlice.actions.setTableLoading({ loading: false, loadingDailyId: 0 }))
            })
    }
    const upsertParticipant_ = (params: UpsertParticipantParam) => {
        dispatch(TimesheetThunkActions.upsertParticipant(params));
    }

    const upsertParticipant = debounce(upsertParticipant_, 500)
    const addUser = () => {
        const userUUID = uuidv4();
        // setTurnOnfilter(false);
        dispatch(timetableSlice.actions.addParticipantLocal({
            dailyId,
            userUUID
        }))
        upsertParticipant({
            dailyId,
            username: "",
            userUUID,
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

    const filterRows = useMemo(() => {
        return debounce(() => {
            if (!day) {
                return;
            }
            const numOfParticipants = day.participants.length;
            const selectionIdToCount = getFinalResultCount(day);
            const ids: number[] = [];
            for (const [selectionId, count] of selectionIdToCount) {
                if (count === numOfParticipants && numOfParticipants >= 2) {
                    ids.push(selectionId);
                }
            }
            setSuccessSelectionIds(ids);
        }, 300)
    }, [day])

    useEffect(() => {
        filterRows();
    }, [day])


    useEffect(() => {
        if (turnOnFilter) {
            if (!day) {
                return;
            }
            const numOfParticipants = day.participants.length;
            const selectionIdToCount = getFinalResultCount(day);
            const ids: number[] = [];
            for (const [selectionId, count] of selectionIdToCount) {
                if (count === numOfParticipants) {
                    ids.push(selectionId);
                }
            }
            setSuccessSelectionIds(ids);

        } else {
            setSuccessSelectionIds([]);
        }
    }, [turnOnFilter])

    if (!startTime) {
        return null;
    }

    const noOption = day.options?.filter(opt => opt.enabled).length === 0;

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
                    backgroundColor: "rgba(0,0,0,0)",
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
                            <Spacer width={10} />
                            <SelectionLoadingSpinner dailyId={dailyId} />
                        </div>


                        <div >
                            {/* <span style={{ opacity: turnOnFilter ? 0.8 : 0.4, fontSize: 14 }}>
                                Highlight Available:
                            </span>  <Switch onChange={(e) => { setTurnOnfilter(e.target.checked) }} /> */}
                        </div>

                    </HPadding>
                </div>

                <Spacer height={8} />

                <HPadding>
                    <div style={{ display: "flex" }}>
                        <table className={cx(classes.firstColumn, "timecolumn")}>
                            <tbody>
                                <tr><td style={{ textAlign: "right", height: 31 }} colSpan={3}></td></tr>
                                <tr><td style={{ textAlign: "right", height: 23 }} colSpan={3}></td></tr>
                                {day?.options.map(opt => {
                                    const { id, option, enabled } = opt;
                                    if (!enabled) {
                                        return null;
                                    }
                                    const from = xdayjs(option).format("hh:mm a")
                                    const to = xdayjs(option).add(1, "hour").format("hh:mm a")
                                    return (
                                        <tr key={id}>
                                            <td style={{ textAlign: "right", width: 60, minWidth: 60, textOverflow: "ellipsis" }}>{from}</td>
                                            <td style={{
                                                textAlign: "center",
                                                width: 10,
                                                textOverflow: "ellipsis",
                                                verticalAlign: "middle"
                                            }}>
                                                <FaArrowRightLong style={{ padding: "0px 10px", paddingTop: 4 }} size={11} />
                                            </td>
                                            <td style={{ textAlign: "left", width: 60, minWidth: 60, textOverflow: "ellipsis" }}>{to}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>


                        {!noOption && <> {day?.participants.map(user => {
                            const { frontendUUID, username, message } = user;
                            if (noOption) {
                                return null;
                            }
                            return (
                                <OptionsColumn
                                    participantMessage={message}
                                    successSelectionIds={successSelectionIds}
                                    key={frontendUUID}
                                    username={username}
                                    dailyId={dailyId}
                                    options={day.options}
                                    uuid={frontendUUID}
                                    checksUpdate={checksUpdate}
                                    upsertParticipant={upsertParticipant}
                                    selections={user.selections}
                                />
                            )
                        })}
                            <Spacer width={30} />
                            <Fab style={{ backgroundColor: "rgba(0,0,0,0.3)", width: 36, height: 36, marginTop: 10 }} onClick={addUser}>
                                <AddIcon style={{ color: "white" }} />
                            </Fab>
                        </>}

                        {noOption && <>
                            No option available
                        </>}


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
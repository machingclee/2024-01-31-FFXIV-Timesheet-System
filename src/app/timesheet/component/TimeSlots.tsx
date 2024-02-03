import { ChecksUpdate, Day, Option, Participant, Selection, TimeSlot, UpsertParticipantParam } from "@/dto/dto";
import useApiClient from "@/hooks/useApiClient";
import { useEffect, useState } from "react";
import { tss } from "tss-react";
import xdayjs from "../../../util/xdayjs"
import MyButton from "@/component/MyButton";
import Spacer from "@/component/Spacer";
import { useAppDispatch } from "@/redux/hooks";
import appSlice from "@/redux/slices/appSlice";
import { Checkbox } from "@mui/material";
import { cloneDeep, debounce } from "lodash";
import { v4 as uuidv4 } from "uuid";
import MyTextField from "@/component/MyTextField";

const ROW_HEIGHT = 30;
const COLUMN_WIDTH = 120;

export default ({ weeklyId }: { weeklyId: string }) => {
    const [timesheets, setTimesheets] = useState<TimeSlot | null>(null);
    const dispatch = useAppDispatch();
    const apiClient = useApiClient();
    useEffect(() => {
        if (!weeklyId) {
            return;
        }
        dispatch(appSlice.actions.setLoading(true));
        apiClient
            .get<{ result: { timeslots: TimeSlot } }>(`/timesheet/get-event-timeslot/${weeklyId}`)
            .then(res => { setTimesheets(res.data.result.timeslots) })
            .finally(() => {
                dispatch(appSlice.actions.setLoading(false));
            })
    }, [weeklyId])

    return (
        <>
            <div key={timesheets?.weeklyId || ""}>
                <Slot slot={timesheets} />
            </div>
        </>
    )
}

const Slot = ({ slot }: { slot: TimeSlot | null }) => {
    if (!slot) {
        return null;
    }
    const { days, weeklyId } = slot;
    return (
        <div>
            {days.map(day => {
                const { dailyId } = day;
                const startingDayjs = xdayjs(day.options?.[0].option);
                const startingDate = startingDayjs.format("YYYY-MM-DD");
                const weekDay = startingDayjs.format("dddd");
                return (
                    <TimesheetTable key={dailyId} day={day} />
                )
            })}
        </div>
    )
}

const TimesheetTable = (props: {
    day: Day,

}) => {
    const { day } = props;
    const { dailyId } = day;
    const startingDayjs = xdayjs(day.options?.[0].option);
    const startingDate = startingDayjs.format("YYYY-MM-DD");
    const weekDay = startingDayjs.format("dddd");
    const { classes, cx } = useStyles();
    const [particiants, setParticipants] = useState<Participant[]>([]);
    const dispatch = useAppDispatch();
    const apiClient = useApiClient();
    const onCheck = (props: ChecksUpdate) => {
        apiClient.post("/timesheet/make-selection", props)
    }
    const upsertParticipant_ = (params: UpsertParticipantParam) => {
        apiClient.post("/timesheet/upsert-participant", params);
    }

    const upsertParticipant = debounce(upsertParticipant_, 500)

    const addUser = () => {
        const userUUID = uuidv4();
        upsertParticipant({
            dailyId,
            username: "",
            userUUID,
        })
        setParticipants(ps => {
            const newPs = cloneDeep(ps);
            newPs.push({
                frontendUUID: userUUID,
                selections: [],
                username: "",
            })
            return newPs;
        })
    }

    useEffect(() => {
        setParticipants(day.participants);
    }, [day])

    return (
        <>
            <div>{startingDate} ({weekDay})</div>
            <Spacer height={10} />
            <MyButton onClick={addUser}>Add Participant</MyButton>
            <Spacer height={10} />
            <div style={{ display: "flex" }} className={cx(classes.table)}>
                <table className={cx(classes.firstColumn)}>
                    <tbody>
                        <tr><td style={{ textAlign: "right", height: 40 }}>Name</td></tr>
                        {day.options.map(opt => {
                            const { id, option } = opt;
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

                {particiants.map(user => {
                    const { frontendUUID, username } = user;
                    return (
                        <OptionsColumn
                            username={username}
                            dailyId={dailyId}
                            options={day.options}
                            uuid={frontendUUID}
                            onCheck={onCheck}
                            upsertParticipant={upsertParticipant}
                            selections={user.selections}
                        />
                    )
                })}
            </div>
            <Spacer />
        </ >
    )
}


const OptionsColumn = ({ username, uuid, options, dailyId, selections, onCheck, upsertParticipant }: {
    username: string,
    uuid: string,
    dailyId: number
    options?: Option[],
    selections: Selection[],
    onCheck: (props: ChecksUpdate) => void,
    upsertParticipant: (params: UpsertParticipantParam) => void
}) => {
    const [name, setName] = useState(username || "");
    const updateName = debounce((text: string) => {
        setName(text);
    }, 1000)

    return (
        <table>
            <tbody>
                <tr><td style={{ textAlign: "center", width: COLUMN_WIDTH }}>
                    <MyTextField
                        defaultValue={name}
                        placeholder="Name"
                        style={{ paddingTop: 0, paddingBottom: 0 }}
                        onChange={e => {
                            const text = e.target.value;
                            updateName(text);
                            upsertParticipant({
                                dailyId,
                                username: text,
                                userUUID: uuid,
                            })
                        }}
                    />
                </td>
                </tr>

                {options?.map(opt => {
                    const { id } = opt;
                    const defaultChecked = (() => {
                        const exists = selections.find(s => s.timeAvailableOptionId === id);
                        if (exists) {
                            return true;
                        } else {
                            return false;
                        }
                    })()
                    return (
                        <tr key={`${uuid}-opt`}>
                            <td style={{ textAlign: "center" }}>
                                <Checkbox
                                    disabled={!name}
                                    defaultChecked={defaultChecked}
                                    onChange={e => {
                                        const checked = e.target.checked;
                                        onCheck({
                                            checked,
                                            selectionId: id,
                                            timeslotDailyId: dailyId,
                                            userUUID: uuid
                                        })
                                    }}
                                />
                            </td>
                        </tr>
                    )
                })}
            </tbody>

        </table>
    )
}

const useStyles = tss.create(() => ({
    firstColumn: {
        "& td:nth-child(3)": {
            paddingRight: 10
        },
        "& td:nth-child(1)": {
            paddingLeft: 10
        }
    },
    table: {
        "& .MuiButtonBase-root.MuiCheckbox-root": {
            padding: 0,
        },
        "& tr": {
            height: ROW_HEIGHT
        },
        "& td": {
            verticalAlign: "middle"
        },
        "& table": {
            borderCollapse: "collapse",
        },
        "& tr:nth-child(2n)": {
            backgroundColor: "rgba(0,0,0,0.1)"
        }
    }
}))
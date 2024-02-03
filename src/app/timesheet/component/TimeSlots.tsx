import { ChecksUpdate, Day, Option, Participant, Selection, TimeSlot, UpsertParticipantParam } from "@/dto/dto";
import useApiClient from "@/hooks/useApiClient";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { tss } from "tss-react";
import xdayjs from "../../../util/xdayjs"
import MyButton from "@/component/MyButton";
import Spacer from "@/component/Spacer";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import appSlice from "@/redux/slices/appSlice";
import { Checkbox, Fab } from "@mui/material";
import { cloneDeep, debounce } from "lodash";
import { v4 as uuidv4 } from "uuid";
import MyTextField from "@/component/MyTextField";
import boxShadow from "@/constants/boxShadow";
import { FadeLoader } from "react-spinners";
import DeleteIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';

const ROW_HEIGHT = 30;
const COLUMN_WIDTH = 120;

export default ({ weeklyId }: { weeklyId: string }) => {
    const [timeslot, setTimeslot] = useState<TimeSlot | null>(null);
    const dispatch = useAppDispatch();
    const apiClient = useApiClient();
    useEffect(() => {
        if (!weeklyId) {
            return;
        }
        dispatch(appSlice.actions.setLoading(true));
        apiClient
            .get<{ result: { timeslots: TimeSlot } }>(`/timesheet/get-event-timeslot/${weeklyId}`)
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
                <Slot slot={timeslot} />
            </div>
            <Spacer height={200} />
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
    const { loading, loadingDailyId: loadingId } = useAppSelector(s => s.app.dailyTable);
    const { day } = props;
    const { dailyId } = day;
    const showSpinner = (dailyId === loadingId) && loading;
    const startingDayjs = xdayjs(day.options?.[0].option);
    const startingDate = startingDayjs.format("YYYY-MM-DD");
    const weekDay = startingDayjs.format("dddd");
    const { classes, cx } = useStyles();
    const [particiants, setParticipants] = useState<Participant[]>([]);
    const dispatch = useAppDispatch();
    const apiClient = useApiClient();
    const onCheck = (props: ChecksUpdate) => {
        dispatch(appSlice.actions.setTableLoading({ loading: true, loadingDailyId: dailyId }))
        apiClient.post("/timesheet/make-selection", props).finally(() => {
            dispatch(appSlice.actions.setTableLoading({ loading: false, loadingDailyId: 0 }))
        })
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
            <div style={{ borderBottom: "4px solid rgba(0,0,0,0.4)", display: "flex" }}>
                <div style={{
                    backgroundColor: "rgba(0,0,0,0.4)",
                    color: "white",
                    padding: "10px 20px",
                    fontWeight: 600,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5
                }}>
                    {startingDate}  ({weekDay})
                </div>
            </div>
            <Spacer height={10} />
            <div style={{ display: "flex" }}>
                <Spacer width={20} />
                {showSpinner && <FadeLoader color="#36d7b7" height={20} width={7} style={{ transform: "scale(0.5)" }} />}
            </div>

            <div style={{ display: "flex", boxShadow: boxShadow.SHADOW_58, padding: 10, borderRadius: 10 }} className={cx(classes.table)}>
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
                            key={frontendUUID}
                            username={username}
                            dailyId={dailyId}
                            options={day.options}
                            uuid={frontendUUID}
                            onCheck={onCheck}
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
            <Spacer />
        </ >
    )
}


const OptionsColumn = ({ username, uuid, options, dailyId, selections, onCheck, setParticipants, upsertParticipant }: {
    username: string,
    uuid: string,
    dailyId: number
    options?: Option[],
    selections: Selection[],
    setParticipants: Dispatch<SetStateAction<Participant[]>>,
    onCheck: (props: ChecksUpdate) => void,
    upsertParticipant: (params: UpsertParticipantParam) => void
}) => {
    const { classes, cx } = useStyles();
    const apiClient = useApiClient();
    const [name, setName] = useState(username || "");
    const [showDelete, setShowDelete] = useState(false);
    const updateName = debounce((text: string) => {
        setName(text);
    }, 1000)

    const deleteColumn = () => {
        setParticipants(ps => {
            const deleteIndex = ps.findIndex(p => p.frontendUUID === uuid);
            console.log("deleteIndexdeleteIndexdeleteIndexdeleteIndex", deleteIndex)
            const ps_ = cloneDeep(ps);
            const newPs = [...ps_.slice(0, deleteIndex), ...ps_.slice(deleteIndex + 1)];
            return newPs;
        })
        apiClient.delete(`/timesheet/delete-participant/${uuid}`)
    }


    return (
        <table>
            <tbody>
                <tr><td style={{ textAlign: "center", width: COLUMN_WIDTH, position: "relative" }}>
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
                    <DeleteIcon
                        onClick={() => { deleteColumn() }}
                        className={cx(classes.deleteButton)}
                        fontSize={"small"}
                        style={{
                            position: "absolute",
                            top: 5,
                            right: 5,
                            cursor: "pointer",
                            zIndex: 10
                        }} />
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
                        <tr key={`${id}-opt`}>
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
    deleteButton: {
        opacity: 0.5,
        "&:hover": {
            opacity: 1
        }
    },
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
import { CheckUpdate, Option, Participant, Selection, UpsertMessageParam, UpsertParticipantParam } from "@/dto/dto";
import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import useTimesheetStyles from "./styles/useTimesheetStyles";
import useApiClient from "@/hooks/useApiClient";
import MyTextField from "@/component/MyTextField";
import WarningDialog from "@/component/dialogs/WarningDialog";
import { useAppDispatch } from "@/redux/hooks";
import { Checkbox, CheckboxProps } from "@mui/material";
import { debounce, cloneDeep } from "lodash";
import { BiMessageRounded } from "react-icons/bi";
import appSlice from "../../../../appSlice";
import DeleteIcon from '@mui/icons-material/Clear';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { tss } from "tss-react";
import { FaCheck } from "react-icons/fa";
import constants from "@/constants/constants";
import sleepUtil from "@/util/sleepUtil";

const OptionsColumn = ({
    participantMessage,
    username,
    uuid,
    options,
    dailyId,
    selections,
    successSelectionIds,
    refreshParticipants,
    checksUpdate,
    setParticipants,
    upsertParticipant
}: {

    participantMessage: string,
    username: string,
    uuid: string,
    dailyId: number
    options?: Option[],
    selections: Selection[],
    successSelectionIds: number[],
    refreshParticipants: () => Promise<void>,
    setParticipants: Dispatch<SetStateAction<Participant[]>>,
    checksUpdate: (props: CheckUpdate[]) => void,
    upsertParticipant: (params: UpsertParticipantParam) => void
}) => {
    const { classes, cx } = useTimesheetStyles();
    const apiClient = useApiClient();
    const [name, setName] = useState(username || "");
    const messageDialogContent = useRef<string>("");
    const updateDialogMessageDialogContent = (msg: string) => {
        messageDialogContent.current = msg;
    }
    const dispatch = useAppDispatch();
    const updateName = debounce((text: string) => {
        setName(text);
    }, 1000)

    const deleteColumn = () => {
        setParticipants(ps => {
            const deleteIndex = ps.findIndex(p => p.frontendUUID === uuid);
            const ps_ = cloneDeep(ps);
            const newPs = [...ps_.slice(0, deleteIndex), ...ps_.slice(deleteIndex + 1)];
            return newPs;
        })
        apiClient.delete(`/timesheet/delete-participant/${uuid}`)
    }

    const updateMessage = async () => {
        const reqBody: UpsertMessageParam = {
            message: messageDialogContent.current,
            participantUUID: uuid
        };
        dispatch(appSlice.actions.setLoading(true));
        await apiClient.post("/timesheet/upsert-message", reqBody);
        dispatch(appSlice.actions.setLoading(false));
        await refreshParticipants();
    }

    const updateRecordsRef = useRef<Map<string, boolean>>(new Map<string, boolean>());

    const deboundedUpdate = useMemo(
        () => debounce((update: CheckUpdate[]) => {
            checksUpdate(update);
            updateRecordsRef.current = new Map<string, boolean>();
        }, 300),
        []
    );
    const addUpdate = (update: CheckUpdate) => {
        const { checked, selectionId, timeslotDailyId, userUUID } = update;
        const id = `${timeslotDailyId},${selectionId},${userUUID}`;
        updateRecordsRef.current.set(id, checked);
    }
    const dispatchUpdate = async () => {
        const updates: CheckUpdate[] = []
        for (const result of updateRecordsRef.current) {
            const [id, value] = result;
            const [timeslotDailyId, selectionId, userUUID] = id.split(",");
            updates.push({
                checked: value,
                selectionId: Number(selectionId),
                timeslotDailyId: Number(timeslotDailyId),
                userUUID: userUUID
            })
        }
        deboundedUpdate(updates);
    }

    return (
        <table>
            <tbody>
                <tr>
                    <td

                        style={{
                            textAlign: "center",
                            opacity: participantMessage ? 1 : 0.2,
                        }}
                        onClick={async () => {
                            WarningDialog.setContent({
                                title: "Message",
                                desc: () => (
                                    <MessageContent
                                        updateDialogMessageDialogContent={updateDialogMessageDialogContent}
                                        uuid={uuid}
                                    />
                                ),
                                no: {
                                    text: "Cancel"
                                },
                                yes: {
                                    text: "Ok",
                                    action: updateMessage
                                }
                            });
                            WarningDialog.open();
                        }}
                    >
                        <BiMessageRounded size={28} />
                    </td>
                </tr>
                <tr>
                    <td style={{ textAlign: "center", width: constants.COLUMN_WIDTH, position: "relative" }}>
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
                        const choice = selections.find(s => s.timeAvailableOptionId === id);
                        if (choice?.checked) {
                            return true;
                        } else {
                            return false;
                        }
                    })()


                    return (
                        <tr key={`${id}-opt`} draggable={false}>
                            <td
                                draggable={false}
                                style={{
                                    textAlign: "center",
                                    cursor: "pointer",
                                    pointerEvents: "auto",
                                }}
                            >
                                <CustomMouseEnterCheckbox
                                    defaultChecked={defaultChecked}
                                    addUpdate={addUpdate}
                                    dispatchUpdate={dispatchUpdate}
                                    selectionId={id}
                                    timeslotDailyId={dailyId}
                                    userUUID={uuid}
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
    checkCell: {
        "&:hover": {
            backgroundColor: "rgba(0,0,0,0.05)"
        },
        cursor: "pointer",
        height: constants.ROW_HEIGHT,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
}))
const CustomMouseEnterCheckbox = ({
    addUpdate,
    dispatchUpdate,
    selectionId,
    timeslotDailyId,
    userUUID,
    defaultChecked,
}: {
    addUpdate: (update: CheckUpdate) => void,
    dispatchUpdate: () => void,
    selectionId: number,
    timeslotDailyId: number,
    userUUID: string,
    defaultChecked: boolean,
}) => {
    const { classes, cx } = useStyles();
    const [checked, setChecked] = useState(defaultChecked);

    const toggle = useMemo(() => () => {
        addUpdate({
            checked: !checked,
            selectionId: selectionId,
            timeslotDailyId: timeslotDailyId,
            userUUID: userUUID
        })
        dispatchUpdate();
        setChecked(c => !c);
    }, [checked])
    return (
        <>
            <div
                draggable={false}
                className={cx(classes.checkCell)}
                onMouseDown={e => {
                    toggle()
                }}
                onMouseEnter={e => {
                    if (e.buttons >= 1) {
                        toggle()
                    }
                }}
            >
                {checked && <FaCheck color="green" size={16} />}
                {!checked && <></>}
            </div>
        </>
    )
}

const MessageContent = ({
    uuid,
    updateDialogMessageDialogContent
}: {
    uuid: string,
    updateDialogMessageDialogContent: (msg: string) => void
}) => {
    const { classes, cx } = useTimesheetStyles();
    const dispatch = useAppDispatch();
    const apiClient = useApiClient();
    const msgDispatched = useRef(false);
    const [msg, setMsg] = useState("");
    useEffect(() => {
        if (!msgDispatched.current) {
            dispatch(appSlice.actions.setLoading(true));
            apiClient.get<{ result: { message: string } }>(
                `/timesheet/get-message/${uuid}`
            ).then((res) => {
                const msg_ = res.data.result.message;
                setMsg(msg_);
            }).finally(() => {
                setTimeout(() => {
                    dispatch(appSlice.actions.setLoading(false));
                }, 500);

            });
            msgDispatched.current = true;
        }
    }, [])

    return (
        <textarea
            defaultValue={msg}
            onKeyUp={e => {
                updateDialogMessageDialogContent(e.currentTarget.value)
            }}
            className={cx(classes.textArea)}
            style={{
                width: 400,
                height: 170
            }}
        />
    )
}

export default OptionsColumn;
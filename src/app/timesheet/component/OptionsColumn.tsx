import { CheckUpdate, Option, Selection, UpdateParticipantParam } from "@/dto/dto";
import { useEffect, useMemo, useRef, useState } from "react";
import useTimesheetStyles from "./styles/useTimesheetStyles";
import useApiClient from "@/hooks/useApiClient";
import MyTextField from "@/component/MyTextField";
import GeneralPurposeDialog from "@/component/dialogs/GeneralPurposeDialog";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { debounce, cloneDeep } from "lodash";
import { BiMessageRounded } from "react-icons/bi";
import appSlice from "../../../../appSlice";
import DeleteIcon from '@mui/icons-material/Clear';
import { tss } from "tss-react";
import { FaCheck } from "react-icons/fa";
import constants from "@/constants/constants";
import timetableSlice, { TimesheetThunkActions } from "@/redux/slices/timetableSlice";
import { FaSmileBeam } from "react-icons/fa";
import { FaFaceSmileBeam } from "react-icons/fa6";
import { FaFaceSmileWink } from "react-icons/fa6";
import { BsEmojiSmileUpsideDownFill } from "react-icons/bs";
import { PiSmileyXEyesFill } from "react-icons/pi";
import { PiSmileyAngryFill } from "react-icons/pi";
import { BsEmojiGrinFill } from "react-icons/bs";
import { BsEmojiKissFill } from "react-icons/bs";
import { BsFillEmojiSunglassesFill } from "react-icons/bs";
import thunks from "@/redux/thunks";
import FadeIn from "@/component/FadeIn";
import useDarkMode from "@/hooks/useDarkMode";

const randomNum = (num: number) => {
    return Math.floor(Math.random() * 9);
}
const smiles = [
    <FaFaceSmileBeam color="green" size={16} />,
    <FaFaceSmileWink color="green" size={16} />,
    <BsEmojiSmileUpsideDownFill color="green" size={16} />,
    <PiSmileyXEyesFill color="green" size={20} />,
    <PiSmileyAngryFill color="green" size={20} />,
    <FaSmileBeam color="green" size={16} />,
    <BsEmojiGrinFill color="green" size={16} />,
    <BsEmojiKissFill color="green" size={16} />,
    <BsFillEmojiSunglassesFill color="green" size={16} />
]
const RandomEmoji = () => {
    const index = randomNum(smiles.length);
    return smiles[index];
}


const OptionsColumn = ({
    orderWithinWeek,
    participantMessage,
    username,
    participantId,
    options,
    dailyId,
    selections,
    participantColumnId,
    successSelectionIds,
    checksUpdate,
}: {
    orderWithinWeek: number,
    participantMessage: string,
    username: string,
    participantId: number,
    dailyId: number
    options?: Option[],
    selections: Selection[],
    participantColumnId: number,
    successSelectionIds: number[],
    checksUpdate: (props: CheckUpdate[]) => void,
}) => {
    const darkMode = useDarkMode();
    const { classes, cx } = useTimesheetStyles({ darkMode });
    const messageDialogContent = useRef<string>("");
    const updateDialogMessageDialogContent = (msg: string) => {
        messageDialogContent.current = msg;
    }
    const dispatch = useAppDispatch();

    const deleteColumn = () => {
        dispatch(TimesheetThunkActions.deleteParticipant({
            participantColumnId
        }));
    }

    const updateMessage = () => {
        dispatch(TimesheetThunkActions.updateMessage({
            dailyId,
            msgUpdate: {
                message: messageDialogContent.current,
                participantId
            }
        }))
    }

    const updateRecordsRef = useRef<Map<string, boolean>>(new Map<string, boolean>());

    const deboundedUpdate = useMemo(
        () => debounce((update: CheckUpdate[]) => {
            checksUpdate(update);
            dispatch(timetableSlice.actions.batchChecksUpdate({ checks: update }))
            updateRecordsRef.current = new Map<string, boolean>();
        }, 300),
        []
    );
    const addUpdate = (update: CheckUpdate) => {
        const { checked, optionId: selectionId, timeslotDailyId, participantId } = update;
        const id = `${timeslotDailyId},${selectionId},${participantId}`;
        updateRecordsRef.current.set(id, checked);
    }
    const dispatchUpdate = async () => {
        const updates: CheckUpdate[] = []
        for (const result of updateRecordsRef.current) {
            const [id, value] = result;
            const [timeslotDailyId, selectionId, participantId] = id.split(",");
            updates.push({
                checked: value,
                optionId: Number(selectionId),
                timeslotDailyId: Number(timeslotDailyId),
                participantId: Number(participantId)
            })
        }
        deboundedUpdate(updates);
    }


    return (
        <table>
            <tbody>
                <tr>
                    <td
                        className="message-bubble"
                        style={{
                            cursor: "pointer",
                            textAlign: "center",
                            opacity: participantMessage ? 1 : 0.2,
                        }}
                        onClick={async () => {
                            GeneralPurposeDialog.setContent({
                                title: "Message",
                                desc: () => (
                                    <MessageContent
                                        updateDialogMessageDialogContent={updateDialogMessageDialogContent}
                                        participantId={participantId}
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
                            GeneralPurposeDialog.open();
                        }}
                    >
                        <BiMessageRounded size={28} />
                    </td>
                </tr>
                <tr>
                    <td style={{
                        textAlign: "center",
                        width: constants.COLUMN_WIDTH, position: "relative",
                        paddingLeft: 5,
                        paddingRight: 5
                    }}>
                        <NameField
                            orderWithinWeek={orderWithinWeek}
                            participantColumnId={participantColumnId}
                            participantId={participantId}
                            username={username}
                        />
                        {orderWithinWeek === 0 && <DeleteIcon
                            onClick={() => { deleteColumn() }}
                            className={cx(classes.deleteButton, "delete-button")}
                            fontSize={"small"}
                            style={{
                                position: "absolute",
                                top: 1,
                                right: 5,
                                cursor: "pointer",
                                zIndex: 10
                            }} />}
                    </td>
                </tr>
                {options?.map(opt => {
                    const { id, enabled } = opt;
                    if (!enabled) {
                        return null;
                    }
                    const defaultChecked = (() => {
                        const choice = selections.find(s => s.timeAvailableOptionId === id);
                        if (choice?.checked) {
                            return true;
                        } else {
                            return false;
                        }
                    })()

                    const isSuccessId = successSelectionIds.includes(id);

                    return (
                        <tr key={`${id}-opt`} draggable={false} className="selectionRow">
                            <td
                                draggable={false}
                                style={{
                                    textAlign: "center",
                                    cursor: "pointer",
                                    pointerEvents: "auto",
                                }}
                            >

                                <CustomMouseEnterCheckbox
                                    isSuccessId={isSuccessId}
                                    defaultChecked={defaultChecked}
                                    addUpdate={addUpdate}
                                    dispatchUpdate={dispatchUpdate}
                                    selectionId={id}
                                    timeslotDailyId={dailyId}
                                    participantId={participantId}
                                />
                            </td>
                        </tr>
                    )
                })}
            </tbody>

        </table>
    )
}

const NameField = ({ username, orderWithinWeek, participantId, participantColumnId }: {
    username: string,
    orderWithinWeek: number,
    participantId: number,
    participantColumnId: number
}) => {
    const flag = useAppSelector(s => s.timetable.columnTextfieldRender.flag?.[participantColumnId]);
    const weeklyId = useAppSelector(s => s.timetable.selectedWeek.weeklyId);
    const dispatch = useAppDispatch();
    const updateColumnName = useMemo(() => {
        return debounce((text: string) => {
            dispatch(thunks.timesheet.updateNamebyColumn({
                weeklyId,
                name: text,
                participantColumnId
            })).unwrap()
        }, 2000)
    }, [])

    const updateDailyName = useMemo(() => {
        return debounce((text: string) => {
            dispatch(thunks.timesheet.updateParticipant({
                username: text,
                participantId
            }))
        }, 800)
    }, [])

    if (!flag) {
        return null;
    }

    return (
        <>
            <div style={{ height: 27 }}>
                <FadeIn>
                    <MyTextField
                        defaultValue={username}
                        placeholder="Name"
                        style={{

                            paddingTop: 0,
                            paddingBottom: 0,
                        }}
                        onChange={e => {
                            const text = e.target.value;
                            if (orderWithinWeek === 0) {
                                updateColumnName(text);
                            } else {
                                updateDailyName(text)
                            }
                        }}
                    />
                </FadeIn>
            </div>
        </>
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
    isSuccessId,
    addUpdate,
    dispatchUpdate,
    selectionId,
    timeslotDailyId,
    participantId,
    defaultChecked,
}: {
    isSuccessId: boolean,
    addUpdate: (update: CheckUpdate) => void,
    dispatchUpdate: () => void,
    selectionId: number,
    timeslotDailyId: number,
    participantId: number,
    defaultChecked: boolean,
}) => {
    const { classes, cx } = useStyles();
    const [checked, setChecked] = useState(defaultChecked);

    const toggle = useMemo(() => () => {
        addUpdate({
            checked: !checked,
            optionId: selectionId,
            timeslotDailyId: timeslotDailyId,
            participantId
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
                {checked && (() => {
                    if (!isSuccessId) {
                        return <FaCheck color="green" size={16} />
                    } else {
                        return <RandomEmoji />
                    }
                })()}
                {!checked && <></>}
            </div>
        </>
    )
}

const MessageContent = ({
    participantId,
    updateDialogMessageDialogContent
}: {
    participantId: number,
    updateDialogMessageDialogContent: (msg: string) => void
}) => {
    const darkMode = useDarkMode();
    const { classes, cx } = useTimesheetStyles({ darkMode });
    const dispatch = useAppDispatch();
    const apiClient = useApiClient();
    const msgDispatched = useRef(false);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (!msgDispatched.current) {
            dispatch(thunks.timesheet.getMessage({ participantId }))
                .unwrap()
                .then((result) => {
                    const { message } = result;
                    setMsg(message);
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
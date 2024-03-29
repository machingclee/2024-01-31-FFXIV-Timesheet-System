import MyButton from "@/component/MyButton";
import { Event, UpdateOptionEnabled } from "@/dto/dto";
import useApiClient from "@/hooks/useApiClient"
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { tss } from "tss-react";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Fab } from "@mui/material";
import Spacer from "@/component/Spacer";
import GeneralPurposeDialog from "@/component/dialogs/GeneralPurposeDialog";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import appSlice from "@/redux/slices/appSlice";
import boxShadow from "@/constants/boxShadow";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";
import Weekday from "../../../component/WeekDay";
import { HiDotsVertical } from "react-icons/hi";
import useMyMenu from "@/hooks/useMyMenu";
import MyTextField from "@/component/MyTextField";
import AnimatedRightArrow from "@/component/AnimatedRightArrow";
import timetableSlice, { TimesheetThunkActions } from "@/redux/slices/timetableSlice";
import TimeRange from "./TimeRange";
import Cache from "@/util/Cache";
import MyButton2 from "@/component/MyButton2";
import useTimeRangeDialog from "@/hooks/useTimeRangeDialog";

export default ({ events }: { events: Event[] }) => {
    const dispatch = useAppDispatch();
    const darkMode = useAppSelector(s => s.auth.darkMode);
    const { classes, cx } = useStyles({ darkMode });
    const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

    const { openEditTimeRangeDialog } = useTimeRangeDialog({
        title: currentEvent?.title || "",
        weeklyId: currentEvent?.id || ""
    })
    const changeTitleRef = useRef(currentEvent?.title);
    const router = useRouter()

    const goToDetail = (weeklyId: string) => {
        dispatch(appSlice.actions.setLoading(true));
        router.push(`/timesheet/detail?weeklyId=${weeklyId}`)
    }

    const resetEnabledList = () => {
        Cache.enableList = new Map<number, boolean>();
    }

    const openDeleteDialog = () => {
        if (!currentEvent) {
            return
        }
        const e = currentEvent;
        const { id: weeklyId, title } = currentEvent;
        GeneralPurposeDialog.setContent({
            title: `Delete ${e.title}?`,
            desc: () => <>Are you sure to delete {title}?</>,
            no: { text: "No" },
            yes: {
                text: "Yes", action: async () => {
                    await dispatch(TimesheetThunkActions.deleteWeekly({ weeklyId }))
                }
            }
        })
        GeneralPurposeDialog.open()
    }

    const changeTitle = (text: string) => {
        changeTitleRef.current = text;
    }

    const openEditDialog = () => {
        if (!currentEvent) {
            return
        }
        const e = currentEvent;
        const { id: weeklyId } = currentEvent
        GeneralPurposeDialog.setContent({
            title: `Edit Title`,
            desc: () => <MyTextField
                className={classes.inputField}
                style={{
                    width: "100%",
                }}
                defaultValue={currentEvent.title}
                onChange={e => changeTitle(e.target.value)}
            />,
            no: { text: "Cancel" },
            yes: {
                text: "Yes", action: () => {
                    const newTitle = changeTitleRef.current || "";
                    dispatch(TimesheetThunkActions.updateWeekly({ title: newTitle, weeklyId }));
                }
            }
        })
        GeneralPurposeDialog.open()
    }

    const { menu, openMenu } = useMyMenu({
        menuItems: [
            {
                label: "Edit Name",
                action: () => { openEditDialog() }
            },
            {
                label: "Edit Time Range",
                action: () => {
                    resetEnabledList();
                    openEditTimeRangeDialog()
                }
            },
            {
                label: "Delete",
                action: () => { openDeleteDialog() }
            }
        ]
    });


    useEffect(() => {
        changeTitleRef.current = currentEvent?.title;
    }, [currentEvent])

    return (
        <div className={cx(classes.tableLikeDiv)}>
            {events.map(event => {
                const { firstOption, id: weekyId, title } = event;


                const firstOpt = dayjs(firstOption.option);
                const from = <div>
                    <div style={{ display: "flex", justifyContent: "center" }} >{firstOpt.format("YYYY-MM-DD")}</div>
                    <Spacer height={5} />
                    <div style={{
                        display: "flex",
                        justifyContent: "center"
                    }}>

                        <Weekday>
                            {firstOpt.format("dddd")}
                        </Weekday>
                    </div>
                </div>
                const to = <div>
                    <div style={{ display: "flex", justifyContent: "center" }}>{firstOpt.add(6, "days").format("YYYY-MM-DD")}</div>
                    <Spacer height={5} />
                    <div style={{ display: "flex", justifyContent: "center" }}> <Weekday>{firstOpt.add(6, "days").format("dddd")}</Weekday></div>
                </div>

                return (
                    <>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                        }}>
                            <div
                                className="clickable"
                                key={event.id}
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    borderRadius: 4,
                                    marginRight: 10,
                                    boxShadow: boxShadow.DARK_MODE_01
                                }}
                                onClick={() => { goToDetail(weekyId) }}
                            >
                                <div style={{
                                    fontWeight: 600,
                                    paddingRight: 20,
                                    fontSize: 18,
                                    paddingTop: 3,

                                }}>
                                    {event.title}
                                </div>
                                <div>
                                    <table className="date">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    {from}
                                                </td>
                                                <td>
                                                    <AnimatedRightArrow />
                                                </td>
                                                <td>
                                                    {to}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <Spacer />
                            <Fab
                                className={cx(classes.deleteButton, "dots")}
                                color="primary"
                                style={{ width: 36, height: 36, backgroundColor: "#593b3b" }}
                                onClick={(e) => {
                                    setCurrentEvent(event);
                                    openMenu(e);
                                }}
                            >
                                <HiDotsVertical size={20} />
                            </Fab>
                            {menu()}
                        </div>
                        <Spacer height={10} />
                    </>
                )
            })}
        </div>
    )
}

const useStyles = tss.withParams<{ darkMode: boolean }>().create(({ darkMode }) => ({
    inputField: {
        "& input": {
            padding: "10px !important",
            fontSize: "16px !important"
        }
    },
    deleteButton: {
        "&:hover": {
            "&.MuiFab-root.MuiFab-circular": {
                backgroundColor: "rgba(255,255,255,0.2) !important"
            }
        }
    },
    tableLikeDiv: {
        "& table.date": {
            "& td:nth-child(1)": {
                width: 100
            },
            "& td:nth-child(2)": {
                textAlign: "center",
                width: 50
            },
            "& td:nth-child(3)": {
                width: 100
            }
        },
        "& .clickable": {
            backgroundColor: "rgba(255,255,255,0.13)",
            "&:hover": {
                backgroundColor: darkMode ? "rgba(255,255,255,0.3) !important" :
                    "rgba(0,0,0,0.1) !important"
            }
        },
        "& > div": {
            "& .clickable": {
                padding: "20px 20px",
                transition: "opacity 0.1s ease-in-out",
                cursor: "pointer",
            }
        },
    }
}))

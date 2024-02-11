import MyButton from "@/component/MyButton";
import { Event } from "@/dto/dto";
import useApiClient from "@/hooks/useApiClient"
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";
import { tss } from "tss-react";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Fab } from "@mui/material";
import Spacer from "@/component/Spacer";
import WarningDialog from "@/component/dialogs/WarningDialog";
import { useAppDispatch } from "@/redux/hooks";
import appSlice from "@/redux/slices/appSlice";
import boxShadow from "@/constants/boxShadow";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";

const Weekday = ({ children }: PropsWithChildren) => {
    return (
        <div style={{
            fontSize: 13,
            backgroundColor: "rgba(255,255,255,0.2)",
            marginTop: 10,
            padding: "2px 10px",
            borderRadius: 20,
            fontWeight: 600
        }}>
            {children}
        </div>
    )
}


export default ({ events, getWeeklyEvents }: { events: Event[], getWeeklyEvents: () => void }) => {
    const apiClient = useApiClient();
    const dispatch = useAppDispatch();
    const { classes, cx } = useStyles();
    const router = useRouter()
    const goToDetail = (weeklyId: string) => {
        router.push(`/timesheet/detail?weeklyId=${weeklyId}`)
    }
    return (
        <div className={cx(classes.tableLikeDiv)}>
            {events.map(e => {
                const { firstOption, id: weekyId, title } = e;
                const firstOpt = dayjs(firstOption.option);
                const from = <div>
                    <div style={{ display: "flex", justifyContent: "center" }} >{firstOpt.format("YYYY-MM-DD")}</div>
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
                    <div style={{ display: "flex", justifyContent: "center" }}>  <Weekday>{firstOpt.add(6, "days").format("dddd")}</Weekday></div>
                </div>

                return (
                    <>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                        }}>
                            <div
                                className="clickable"
                                key={e.id}
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
                                    fontWeight: 500,
                                    borderRight: "4px solid rgba(0,0,0,0.3)",
                                    paddingRight: 20,
                                    fontSize: 18,
                                    paddingTop: 3
                                }}>
                                    {e.title}
                                </div>
                                <div>
                                    <table className="date">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    {from}
                                                </td>
                                                <td>
                                                    <HiOutlineChevronDoubleRight size={22} />
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
                                className={cx(classes.deleteButton)}
                                color="primary"
                                style={{ width: 36, height: 36, backgroundColor: "#593b3b" }}
                                onClick={() => {
                                    WarningDialog.setContent({
                                        title: `Delete ${e.title}?`,
                                        desc: () => <>Are you sure to delete {e.title}?</>,
                                        no: { text: "No" },
                                        yes: {
                                            text: "Yes", action: () => {
                                                dispatch(appSlice.actions.setLoading(true));
                                                apiClient.delete(`/timesheet/delete-weekly/${weekyId}`).finally(() => {
                                                    dispatch(appSlice.actions.setLoading(false));
                                                    getWeeklyEvents();
                                                })

                                            }
                                        }
                                    })
                                    WarningDialog.open()
                                }}
                            >
                                <DeleteForeverIcon />
                            </Fab>
                        </div>
                        <Spacer height={10} />
                    </>
                )
            })}
        </div>
    )
}

const useStyles = tss.create(() => ({
    deleteButton: {
        transition: "opacity 0.1s ease-in-out",
        "&: hover": {
            opacity: 0.5
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
            backgroundColor: "rgba(255,255,255,0.2)"
        },
        "& > div:nth-child(4n+3)": {
            "& .clickable": {
                backgroundColor: "rgba(255,255,255,0.1)"
            }
        },
        "& > div:nth-child(4n+1)": {
            "& .clickable": {
                backgroundColor: "rgba(255,255,255,0.05)"
            }
        },
        "& > div": {
            "& .clickable": {
                padding: "20px 20px",
                transition: "opacity 0.1s ease-in-out",
                cursor: "pointer"
            }
        },
        "& > div:hover": {
            "& .clickable": {
                opacity: 0.5
            }
        },
    }
}))

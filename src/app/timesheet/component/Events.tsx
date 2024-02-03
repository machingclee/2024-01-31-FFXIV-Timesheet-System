import MyButton from "@/component/MyButton";
import { Event as WeeklyEvents } from "@/dto/dto";
import useApiClient from "@/hooks/useApiClient"
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { tss } from "tss-react";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Fab } from "@mui/material";
import Spacer from "@/component/Spacer";
import WarningDialog from "@/component/dialogs/WarningDialog";
import { useAppDispatch } from "@/redux/hooks";
import appSlice from "@/redux/slices/appSlice";

const useStyles = tss.create(() => ({
    tableLikeDiv: {
        "& > div:nth-child(4n+3)": {
            "& .clickable": {
                backgroundColor: "rgba(0,0,0,0.05)"
            }
        },
        "& > div:nth-child(4n+1)": {
            "& .clickable": {
                backgroundColor: "rgba(0,0,0,0.1)"
            }
        },
        "& > div": {
            "& .clickable": {
                padding: 10,
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

export default ({ events, getWeeklyEvents }: { events: WeeklyEvents[], getWeeklyEvents: () => void }) => {
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
                const from = firstOpt.format("YYYY-MM-DD (ddd)")
                const to = firstOpt.add(6, "days").format("YYYY-MM-DD (ddd)")
                return (
                    <>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div
                                className="clickable"
                                key={e.id}
                                style={{ flex: 1, display: "flex", justifyContent: "space-between" }}
                                onClick={() => { goToDetail(weekyId) }}
                            >
                                <div>{e.title}</div> <div>{from} to {to}</div>
                            </div>
                            <Spacer />
                            <Fab
                                color="primary"
                                style={{ width: 36, height: 36, backgroundColor: "red" }}
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
                        <Spacer height={5} />
                    </>
                )
            })}
        </div>
    )
}
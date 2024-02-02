import MyButton from "@/component/MyButton";
import { Event } from "@/dto/dto";
import useApiClient from "@/hooks/useApiClient"
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { tss } from "tss-react";

const useStyles = tss.create(() => ({
    tableLikeDiv: {

        "& > div:nth-child(2n)": {
            backgroundColor: "rgba(0,0,0,0.05)"
        },
        "& > div:nth-child(2n+1)": {
            backgroundColor: "rgba(0,0,0,0.1)"
        },
        "& > div": {
            padding: 10,
            transition: "opacity 0.1s ease-in-out",
            cursor: "pointer"
        },
        "& > div:hover": {
            opacity: 0.5
        },
    }
}))

export default ({ events }: { events: Event[] }) => {
    const apiClient = useApiClient();
    const { classes, cx } = useStyles();
    const router = useRouter()
    const goToDetail = (weeklyId: string) => {
        router.push(`/timesheet/detail?weeklyId=${weeklyId}`)
    }
    return (
        <div className={cx(classes.tableLikeDiv)}>
            {events.map(e => {
                const { firstOption, id, title } = e;
                const firstOpt = dayjs(firstOption.option);
                const from = firstOpt.format("YYYY-MM-DD (ddd)")
                const to = firstOpt.add(6, "days").format("YYYY-MM-DD (ddd)")
                return (
                    <div
                        key={e.id}
                        style={{ display: "flex", justifyContent: "space-between" }}
                        onClick={() => { goToDetail(id) }}
                    >
                        <div>{e.title}</div> <div>{from} to {to}</div>
                    </div>
                )
            })}
        </div>
    )
}
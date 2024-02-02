"use client";

import useParams from "@/hooks/useParams";
import TimeSlots from "../component/TimeSlots";

export default () => {
    const params = useParams<{ weeklyId: string }>();
    const weeklyId = params.get("weeklyId");

    return (
        <div>
            <TimeSlots weeklyId={weeklyId || ""} />
        </div>
    )

}
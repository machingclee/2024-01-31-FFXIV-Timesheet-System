"use client";

import useParams from "@/hooks/useParams";
import TimeSheetsWeekly from "../component/TimeSheetsWeekly";

export default () => {
    const params = useParams<{ weeklyId: string }>();
    const weeklyId = params.get("weeklyId");

    return (
        <div>
            <TimeSheetsWeekly weeklyId={weeklyId || ""} />
        </div>
    )

}
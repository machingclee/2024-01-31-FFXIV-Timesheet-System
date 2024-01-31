"use client";

import AddTimeSlot from "../component/AddTimeSlot";

export default () => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return <AddTimeSlot />
}
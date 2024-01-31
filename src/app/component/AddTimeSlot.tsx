"use client";

import MyButton from "@/component/MyButton";
import MyTextField from "@/component/MyTextField";
import Spacer from "@/component/Spacer";
import Title from "@/component/Title";
import { CreateTimeSlotParam } from "@/dto/dto";
import useApiClient from "@/hooks/useApiClient";
import { useAppSelector } from "@/lib/hooks";
import getTimezone from "@/util/getTimzone";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from "dayjs";
import { useRef, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { tss } from "tss-react";

const useStyles = tss.create(() => ({
    timePicker: {
        "& input": {
            padding: "8px 8px"
        }
    }
}))

export default () => {
    const email = useAppSelector(s => s.auth.email);
    const newTimeslotName = useRef("");
    const apiClient = useApiClient();
    const currDayjs = dayjs(new Date());
    const [value, setValue] = useState<Dayjs | null>(currDayjs);
    const { classes, cx } = useStyles();
    const addATimeSlot = () => {
        const timeZone = getTimezone();
        apiClient.post("/timesheet/create-timeslot", {
            email,
            name: newTimeslotName.current,
            startDate: value?.format("YYYY-MM-DD"),
            timeZone
        } as CreateTimeSlotParam)
    }
    return <>
        <Title title="Event Time Slots" />
        <Spacer />
        <div style={{ display: "flex", alignItems: "center" }}>
            <MyTextField
                id="outlined-size-small"
                defaultValue=""
                onChange={e => newTimeslotName.current = e.target.value}
                size="small"
                placeholder="Event Name"
            />
            <Spacer />
            <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        className={cx(classes.timePicker)}
                        value={value}
                        onChange={(newValue) => setValue(newValue)}
                    />
                </LocalizationProvider >
            </div>
            <Spacer />
            <Spacer width={20} />
            <MyButton onClick={addATimeSlot}>Add a timeslot</MyButton>
            <Spacer width={8} />
            <FaInfoCircle title="7 days will be added in a row" />
        </div>
    </>
}

"use client";

import { TextField, TextFieldProps } from "@mui/material";
import { tss } from "tss-react";

const useStyles = tss.create(() => ({
    input: {
        "& input": {
            paddingTop: 4,
            paddingBottom: 4,
            fontSize: 14,
        },
        "& fieldset": {
            display: "none",
        },
        backgroundColor: "rgba(0,0,0,0.08)",
        borderRadius: 4,
    }
}))


export default (props: TextFieldProps) => {
    const { classes, cx } = useStyles();
    const { className, ...props_ } = props;
    return (
        <TextField
            className={cx(className, classes.input)}
            id="outlined-size-small"
            size="small"
            {...props_}
        />
    )
}
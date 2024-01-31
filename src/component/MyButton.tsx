"use client";

import { Button, ButtonProps } from "@mui/material";
import { PropsWithChildren } from "react";
import { tss } from "tss-react";

const useStyles = tss.create(() => ({
    myButton: {
        textTransform: "none",
        paddingTop: 2,
        paddingBottom: 2,
    }
}))

export default ({ children, ...props }: PropsWithChildren & ButtonProps) => {
    const { classes, cx } = useStyles();
    const { className, ...props_ } = props;
    return (
        <Button
            variant="contained"
            className={cx(className, classes.myButton)}
            {...props_}
        >
            {children}
        </Button>
    )
}
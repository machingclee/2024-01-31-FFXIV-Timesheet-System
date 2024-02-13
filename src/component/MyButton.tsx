"use client";

import { Button, ButtonProps } from "@mui/material";
import { PropsWithChildren } from "react";
import { tss } from "tss-react";
import { TEXT_COLOR } from "./Body";
import { useAppSelector } from "@/redux/hooks";

const useStyles = tss.withParams<{ darkMode: boolean }>().create(({ darkMode }) => ({
    myButton: {
        color: TEXT_COLOR,
        textTransform: "none",
        paddingTop: 4,
        paddingBottom: 4,
        fontWeight: 400,
        backgroundColor: "rgb(60,60,60)"
    }
}))

export default ({ children, ...props }: PropsWithChildren & ButtonProps) => {
    const darkMode = useAppSelector(s => s.auth.darkMode);
    const { classes, cx } = useStyles({ darkMode });
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
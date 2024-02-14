"use client";

import { Button, ButtonProps } from "@mui/material";
import { PropsWithChildren } from "react";
import { tss } from "tss-react";
import { TEXT_COLOR, TEXT_DARK_COLOR } from "./Body";
import { useAppSelector } from "@/redux/hooks";

const useStyles = tss.withParams<{ darkMode: boolean }>().create(({ darkMode }) => ({
    myButton: {
        color: darkMode ? TEXT_COLOR : `${TEXT_DARK_COLOR} !important`,
        textTransform: "none",
        paddingTop: 4,
        paddingBottom: 3,
        fontWeight: 500,
        backgroundColor: darkMode ? "rgb(80,80,80)" : "rgb(240,240,240)",
        "&:hover": {
            backgroundColor: "rgba(0,0,0,0.2)"
        }
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


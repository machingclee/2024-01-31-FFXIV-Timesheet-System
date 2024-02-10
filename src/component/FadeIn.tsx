import React, { ReactNode, useEffect, useState } from "react";
import classnames from "classnames";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(
    {
        "@keyframes fadein": {
            "0%": {
                opacity: 0,
            },
            "100%": {
                opacity: 1
            }
        },
        customFadein: {
            "&.fade-in": {
                animation: "$fadein .3s ease-in-out"
            }
        }
    },
    { name: "custom-fade-in" }
)


export default function FadeIn({ children, dependencies = [] }:
    {
        children: ReactNode
        dependencies?: any[]
    }) {
    const [fadeIn, setFadeIn] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        setFadeIn(false);
        setTimeout(() => { setFadeIn(true); }, 1);
    }, [...dependencies]);

    return (
        <div style={{ opacity: fadeIn ? 1 : 0 }}>
            <div
                className={classnames(classes.customFadein, fadeIn ? "fade-in" : "")}
            >
                <>
                    {children}
                </>
            </div>
        </div>
    );
}
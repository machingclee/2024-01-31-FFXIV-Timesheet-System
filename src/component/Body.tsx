"use client";

import boxShadow from "@/constants/boxShadow";
import { PropsWithChildren } from "react";
import { tss } from "tss-react";

export default ({ children }: PropsWithChildren) => {
    const { classes, cx } = bodyStyle();
    return <div className={cx(classes.body)}>
        {children}
    </div>
}

export const TEXT_COLOR = "rgb(220,220,220)"

const bodyStyle = tss.create(() => ({
    body: {
        backgroundColor: "rgba(0,0,0,0.9)",
        color: TEXT_COLOR,
        "& .timecolumn": {
            color: "white !important"
        },
        "& .timesheet": {
            backgroundColor: "rgba(255,255,255,0.1)",
            "& tr:nth-child(2n)": {
                backgroundColor: "rgba(0,0,0,0.3)"
            },
            "& tr:nth-child(2)": {
                backgroundColor: "unset"
            }
        },
        "& .selectionRow": {
            "& svg": {
                color: "#32e763 !important"
            }
        },
        "& .MuiInputBase-root.MuiOutlinedInput-root": {
            color: "white",
            backgroundColor: "rgba(255,255,255,0.2)"
        },
        "& div": {
            color: TEXT_COLOR,
        },
        "& .navbar": {
            backgroundColor: "rgba(0,0,0,0.65)",
            borderBottom: "1px solid rgba(255,255,255,0.2)"
        },
        "& .user-guide-tag": {
            "& .MuiButtonBase-root.MuiButton-root": {
                "&.unselected": {
                    backgroundColor: "rgba(255,255,255,0.2) !important",
                },
                "& b": {
                    color: TEXT_COLOR
                }
            }
        },
        "& .user-guide-container": {
            display: "flex",
            alignItems: "center",
            maxWidth: 838,
            width: 838,
            "& img": {
                width: "100%",
                borderRadius: 8
            }
        }
    }
}))


"use client";

import boxShadow from "@/constants/boxShadow";
import { useAppSelector } from "@/redux/hooks";
import { draftMode } from "next/headers";
import { PropsWithChildren } from "react";
import { tss } from "tss-react";

export default ({ children }: PropsWithChildren) => {
    const darkMode = useAppSelector(s => s.auth.darkMode);
    const { classes, cx } = bodyStyle({ darkMode });
    return <div className={cx(classes.body)}>
        {children}
    </div>
}

export const TEXT_COLOR = "rgb(220,220,220)"
export const TEXT_DARK_COLOR = "rgba(0,0,0,0.7)"

const bodyStyle = tss.withParams<{ darkMode: boolean }>()
    .create(({ darkMode = true }) => ({
        body: {
            "& .delete-button": {
                color: darkMode ? TEXT_COLOR : `${TEXT_DARK_COLOR} !important`,
            },

            "& .event-name-input": {
                backgroundColor: darkMode ? "rgba(255,255,255,0)" : "rgba(255,255,255,0.1)",
                "& input": {
                    padding: "10px 10px",
                },
                "& input::placeholder": {
                    opacity: 1
                }
            },
            "& .dots": {
                "button#{&}": {
                    backgroundColor: "rgba(0,0,0,0.1) !important",
                    "& svg": {
                        color: darkMode ? TEXT_COLOR : `${TEXT_DARK_COLOR} !important`,
                    }
                }
            },
            "& .clickable": {
                boxShadow: darkMode ? `${boxShadow.DARK_MODE_01} !important` : `${boxShadow.SHADOW_62} !important`,
                backgroundColor: darkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.2) !important",
                "& svg": {
                    color: darkMode ? TEXT_COLOR : `${TEXT_DARK_COLOR} !important`,
                }
            },
            ".event-title": {
                color: darkMode ? TEXT_COLOR : `${TEXT_DARK_COLOR} !important`,
            },
            "& .message-bubble": {
                "& div, svg": {
                    color: darkMode ? TEXT_COLOR : `${TEXT_DARK_COLOR} !important`,
                }
            },
            "& .title-separator": {
                "& div, svg": {
                    color: darkMode ? TEXT_COLOR : `${TEXT_DARK_COLOR} !important`,
                    "&.ruler": {
                        backgroundColor: darkMode ? TEXT_COLOR : `${TEXT_DARK_COLOR} !important`
                    }
                }
            },
            "h2, div": {
                "& svg": {
                    color: `${TEXT_COLOR} !important`
                },
                color: darkMode ? TEXT_COLOR : `${TEXT_DARK_COLOR} !important`,
                "&.email, .darkmode-button": {
                    color: `${TEXT_COLOR} !important`,
                }
            },

            "& .date-picker": {
                "& svg": {
                    color: darkMode ? TEXT_COLOR : `${TEXT_DARK_COLOR} !important`
                }
            },
            "& h2": {
                color: darkMode ? TEXT_COLOR : `${TEXT_DARK_COLOR} !important`,
            },
            backgroundColor: darkMode ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.1)",
            color: TEXT_COLOR,
            "& .timecolumn": {
                color: darkMode ? "white !important" : "black",
                "& input": {
                    // backgroundColor: "rgba(0,0,0,0.2) !important"
                }
            },
            "& .timesheet": {
                backgroundColor: darkMode ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.6)",
                "& tr:nth-child(2n)": {
                    backgroundColor: darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"
                },
                "& tr:nth-child(2)": {
                    backgroundColor: darkMode ? "unset" : "unset"
                }
            },
            "& .selectionRow": {
                "& svg": {
                    color: darkMode ? "#a0f3b6 !important" : "#3f9d65 !important"
                }
            },
            "& .MuiInputBase-root.MuiOutlinedInput-root": {
                color: "white",
                backgroundColor: darkMode ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.2)",

            },
            "& div": {
                color: darkMode ? TEXT_COLOR : `${TEXT_DARK_COLOR} !important`,
            },
            "& .navbar": {
                backgroundColor: "rgb(37,36,36)",
            },
            "& .user-guide-tag": {
                "& .MuiButtonBase-root.MuiButton-root": {
                    "&.unselected": {
                        backgroundColor: "rgba(255,255,255,0.2) !important",
                        color: darkMode ? TEXT_COLOR : `${TEXT_DARK_COLOR} !important`,
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


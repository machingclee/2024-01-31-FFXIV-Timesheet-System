import { TEXT_COLOR_LIGHT, TEXT_COLOR_DARK } from "@/component/Body";
import boxShadow from "@/constants/boxShadow";
import { tss } from "tss-react";

export default tss.withParams<{ darkMode: boolean }>()
    .create(({ darkMode }) => ({
        eventMenu: {
            "& .MuiPaper-root.MuiPopover-paper": {
                border: darkMode ? "1px solid rgb(35,35,35)" : "1px solid rgba(0,0,0,0.2)",
                boxShadow: "unset",
            },
            "& li": {
                fontSize: "0.9rem !important",
                color: darkMode ? TEXT_COLOR_LIGHT : `${TEXT_COLOR_DARK} !important`
            },
            transform: "translateX(-10px)",
            "& .MuiPaper-root": {

                width: 200,
                color: TEXT_COLOR_LIGHT,
                "& .MuiMenu-list": {
                    paddingTop: 0,
                    paddingBottom: 0,
                    "& li": {
                        "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.2)"
                        }
                    }
                },
                backgroundColor: darkMode ? "rgb(70,70,70)" : "rgb(230,230,230)",
                backdropFilter: "blur(100px)"
            }
        }
    }))
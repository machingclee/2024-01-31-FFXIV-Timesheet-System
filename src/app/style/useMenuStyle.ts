import { TEXT_COLOR, TEXT_DARK_COLOR } from "@/component/Body";
import boxShadow from "@/constants/boxShadow";
import { tss } from "tss-react";

export default tss.withParams<{ darkMode: boolean }>()
    .create(({ darkMode }) => ({
        eventMenu: {
            "& .MuiPaper-root.MuiPopover-paper": {
                boxShadow: darkMode ? `${boxShadow.SHADOW_53} !important` :
                    `rgba(0,0,0, 0.1) 0px 4px 8px -2px,rgba(0,0,0, 0.08) 0px 0px 0px 1px !important`
            },
            "& li": {
                color: darkMode ? TEXT_COLOR : `${TEXT_DARK_COLOR} !important`
            },
            transform: "translateX(-10px)",
            "& .MuiPaper-root": {
                width: 200,
                color: TEXT_COLOR,
                "& .MuiMenu-list": {
                    paddingTop: 0,
                    paddingBottom: 0
                },
                backgroundColor: darkMode ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.4)",
                backdropFilter: "blur(100px)"
            }
        }
    }))
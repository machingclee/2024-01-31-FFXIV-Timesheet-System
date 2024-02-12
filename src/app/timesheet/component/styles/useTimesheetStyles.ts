import constants from "@/constants/constants";
import { tss } from "tss-react";



const useTimesheetStyles = tss.create(() => ({
    textArea: {
        borderRadius: 4,
        resize: "none",
        backgroundColor: "rgba(0,0,0,0.1)",
        border: 0,
        outline: "none",
        padding: 10
    },
    deleteButton: {
        opacity: 0.5,
        "&:hover": {
            opacity: 1
        }
    },
    firstColumn: {
        "& td:nth-child(3)": {
            paddingRight: 10
        },
        "& td:nth-child(1)": {
            paddingLeft: 10
        }
    },
    successCell: {
        "td#{&}": {
            "& .Mui-checked": {
                color: "white !important"
            },
            backgroundColor: "#e6f38f91 !important",
            color: "white",
        }
    },
    table: {

        "& .MuiButtonBase-root.MuiCheckbox-root": {
            padding: 0,
        },
        "& tr": {
            height: constants.ROW_HEIGHT
        },
        "& td": {
            verticalAlign: "middle"
        },
        "& table": {
            borderCollapse: "collapse",
            fontSize: 12,
        },
        "& tr:nth-child(2n)": {
            // backgroundColor: "rgba(0,0,0,0.1)"
        },
        "& tr:nth-child(2)": {
            backgroundColor: "unset"
        }
    }
}))

export default useTimesheetStyles
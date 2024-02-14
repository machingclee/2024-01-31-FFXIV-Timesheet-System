import FadeIn from "@/component/FadeIn";
import Spacer from "@/component/Spacer";
import boxShadow from "@/constants/boxShadow";
import { Event, TimesheetOption, UpdateOptionEnabled } from "@/dto/dto";
import useFontColor from "@/hooks/useFontColor";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { TimesheetThunkActions } from "@/redux/slices/timetableSlice";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { tss } from "tss-react";

export default (props: {
    enabledList: Map<number, boolean>
}) => {
    const { enabledList } = props
    const darkMode = useAppSelector(s => s.auth.darkMode);
    const optionsByDays = useAppSelector(s => s.timetable.timerange.options);
    const rerenderFlag = useAppSelector(s => s.timetable.timerange.rerenderFlag);
    const { classes, cx } = useStyles({ darkMode });

    const toggle = (optionId: number, enabled: boolean) => {
        enabledList.set(optionId, enabled);
    }

    return (
        <div style={{ maxHeight: 800 }}>
            <div>
                {rerenderFlag && <FadeIn>
                    {optionsByDays.map(opts => {
                        const { option } = opts?.[0];
                        const dayJS = dayjs(option);
                        const date = dayJS.format("YYYY-MM-DD");
                        const day = dayJS.format("dddd");
                        return (
                            <>
                                <div style={{ fontWeight: 600 }}>
                                    {date} ({day})
                                </div>
                                <Spacer height={5} />
                                <div key={opts?.[0].id}>
                                    <div style={{
                                        backgroundColor: darkMode ? "rgba(255,255,255,0.1)" : "rgb(255,255,255)",
                                        boxShadow: boxShadow.SHADOW_58,
                                        borderRadius: 4,
                                        padding: 10
                                    }}>
                                        <table className={cx(classes.enableTimeTable)}>
                                            <tbody>
                                                {opts.map(opt => {
                                                    const currTime = dayjs(opt.option);
                                                    const nextTime = currTime.add(1, "h");
                                                    const currTimeStr = currTime.format("hh:mm a")
                                                    const nextTimeStr = nextTime.format("hh:mm a")
                                                    return (
                                                        <tr key={opt.option}>
                                                            <td >
                                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                                    {currTimeStr}
                                                                    <FaArrowRightLong style={{ padding: "0px 10px" }} size={12} />
                                                                    {nextTimeStr}
                                                                </div>
                                                            </td>
                                                            <td className={cx(classes.enableDisableTD)}>
                                                                <LocalEnableDisable
                                                                    defaultEnabled={opt.enabled}
                                                                    toggle={toggle}
                                                                    optionId={opt.id}
                                                                />
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <Spacer />
                            </>
                        )
                    })}
                </FadeIn>}
            </div>
        </div>
    )
}

const LocalEnableDisable = (props: {
    optionId: number,
    defaultEnabled: boolean,
    toggle: (optionId: number, enabled: boolean) => void,
}) => {
    const { defaultEnabled, optionId, toggle } = props;
    const [enabled, setEnabled] = useState(defaultEnabled);
    const clicked = useRef(false);
    const clickHandler = () => {
        if (!clicked.current) {
            toggle(optionId, !enabled);
            setEnabled(e => !e);
            clicked.current = true
        }
    }
    return (
        <div
            style={{ opacity: enabled ? 1 : 0.4 }}
            onMouseDown={e => {
                clickHandler();
            }}
            onMouseEnter={e => {
                if (e.buttons >= 1) {
                    clickHandler();
                }
            }}
            onMouseUp={() => {
                clicked.current = false
            }}
            onMouseLeave={() => {
                clicked.current = false
            }}
        >
            {enabled && <div className="enabled" style={{ fontWeight: 600 }}>Enabled</div>}
            {!enabled && <div className="disabled" style={{ fontWeight: 600 }}>Disabled</div>}
        </div>
    )
}


const useStyles = tss.withParams<{ darkMode: boolean }>().create(({ darkMode }) => ({
    enableDisableTD: {

        "& td": {
            width: 100,
            userSelect: "none",
            "& div": {
                userSelect: "none",
            }
        },
        "& div": {
            height: 20,
            fontSize: 13,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            "&:hover": {
                backgroundColor: "rgba(0,0,0,0.1)"
            }
        }
    },
    enableTimeTable: {
        "& div.enabled": {
            color: darkMode ? "#d1f5d1 !important" : "#6f7b43 !important"
        },
        "&": {
            width: "100%",
            userSelect: "none",
        },
        "& td:nth-child(1)": {
            padding: "2px 10px",
            fontSize: 14,
        },
        "& td:nth-child(2)": {
            width: 100
        },
        "& tr:nth-child(2n)": {
            backgroundColor: darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.07)"
        },
        "& tr:nth-child(2n+1)": {
            backgroundColor: darkMode ? "unset" : "unset"
        }
    }
}))
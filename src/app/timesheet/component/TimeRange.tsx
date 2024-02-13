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
    event: Event,
    enabledList: Map<number, boolean>
}) => {
    const { event, enabledList } = props
    const { id: weeklyId } = event;
    const darkMode = useAppSelector(s => s.auth.darkMode);
    const optionsByDays = useAppSelector(s => s.timetable.timerange.options);
    const rerenderFlag = useAppSelector(s => s.timetable.timerange.rerenderFlag);
    const { classes, cx } = useStyles({ darkMode });
    const dispatch = useAppDispatch();
    const fetched = useRef(false);

    const toggle = (optionId: number, enabled: boolean) => {
        enabledList.set(optionId, enabled);
    }

    useEffect(() => {
        if (!fetched.current) {
            dispatch(TimesheetThunkActions.getTimeOptionsWeekly({ weeklyId }));
            fetched.current = true;
        }
    }, [])

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
    const clickHandler = () => {
        toggle(optionId, !enabled);
        setEnabled(e => !e);
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
        >
            {enabled && "Enabled"}
            {!enabled && "Disabled"}
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
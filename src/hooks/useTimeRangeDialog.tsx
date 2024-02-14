import TimeRange from "@/app/timesheet/component/TimeRange";
import MyButton2 from "@/component/MyButton2";
import GeneralPurposeDialog from "@/component/dialogs/GeneralPurposeDialog";
import { UpdateOptionEnabled } from "@/dto/dto";
import { useAppDispatch } from "@/redux/hooks";
import timetableSlice, { TimesheetThunkActions } from "@/redux/slices/timetableSlice";
import Cache from "@/util/Cache";

export default (props: {
    weeklyId: string,
    title: string,
    orderWithinWeek?: number,
    fetchTimetablesOnComplete?: boolean
}) => {
    const { title, weeklyId, orderWithinWeek, fetchTimetablesOnComplete = false } = props;
    const dispatch = useAppDispatch();
    const applyFirstDayToAll = () => {
        dispatch(timetableSlice.actions.duplicateTimeRangeOfFirstDay());
        dispatch(timetableSlice.actions.setTimerangeRerenderFlag(false));
        setTimeout(() => {
            dispatch(timetableSlice.actions.setTimerangeRerenderFlag(true));
        }, 1)
    }

    const openEditTimeRangeDialog = async () => {
        GeneralPurposeDialog.setContent({
            title: `Enable/Disable Timeslots for ${title}`,
            width: 800,
            desc: () => <TimeRange enabledList={Cache.enableList} orderWithinWeek={orderWithinWeek} />,
            no: { text: "Cancel" },
            yes: {
                text: "Submit", action: async () => {
                    const updateList: UpdateOptionEnabled[] = [];
                    for (const [optionId, enabled] of Cache.enableList) {
                        updateList.push({ optionId, enabled });
                    }
                    await dispatch(TimesheetThunkActions.updateEnabledTimeslot(updateList)).unwrap();
                    if (fetchTimetablesOnComplete) {
                        dispatch(TimesheetThunkActions.getWeeklyTimetables({ weeklyId }));
                    }
                }
            },
            upperRightButton: () => (
                <>
                    {orderWithinWeek === 0 && <MyButton2 variant="text" onClick={applyFirstDayToAll}>
                        <div>
                            <div>Duplicate Day 1</div>
                            <div>to Remaining</div>
                        </div>
                    </MyButton2>}
                </>
            )
        })
        await dispatch(TimesheetThunkActions.getTimeOptionsWeekly({ weeklyId })).unwrap();
        GeneralPurposeDialog.open()
    }

    return { openEditTimeRangeDialog }
}
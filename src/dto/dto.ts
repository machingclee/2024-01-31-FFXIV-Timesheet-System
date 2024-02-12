export type CreateTimeSlotParam = {
    email: string,
    name: string,
    timeZone: string,
    startDate: string
}

export type MyResponse<T> = {
    success: true,
    result: T
} | {
    success: false,
    errorMessage: Object
}

export type Option = {
    id: number,
    option: number
}


export type Day = {
    orderWithinWeek: number;
    dailyId: number;
    options: Option[];
    participants: Participant[]
}

export type TimeSheetsWeeklyProps = {
    title: string,
    weeklyId: string,
    days: Day[]
}

export type Event = {
    id: string,
    title: string,
    firstOption: { option: number }
}

export type Selection = {
    timeAvailableOptionId: number
    checked: boolean
}

export type Participant = {
    frontendUUID: string,
    message: string,
    username: string
    selections: Selection[]
}

export type UpsertParticipantParam = {
    userUUID: string,
    username: string,
    dailyId: number
}

export type CheckUpdate = {
    optionId: number,
    userUUID: string,
    timeslotDailyId: number,
    checked: boolean
}

export type UpsertMessageParam = {
    participantUUID: string,
    message: string
}
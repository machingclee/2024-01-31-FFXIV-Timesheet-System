export type CreateTimeSlotParam = {
    email: string,
    name: string,
    startTimestamp: number,
    timeZone: string
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
    option: number,
    enabled: boolean
}


export type Day = {
    orderWithinWeek: number,
    ownerEmail: string,
    dailyId: number,
    options: Option[],
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

export type TimesheetOption = {
    id: number,
    enabled: boolean,
    option: number
}

export type UpdateOptionEnabled = {
    optionId: number,
    enabled: boolean
}

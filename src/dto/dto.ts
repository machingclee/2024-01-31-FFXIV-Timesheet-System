export type CreateTimeSlotParam = {
    email: string,
    name: string,
    timeZone: string,
    startDate: string
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
    id: number,
    participantId: number,
    timeAvailableOptionId: number
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

export type ChecksUpdate = {
    selectionId: number,
    userUUID: string,
    timeslotDailyId: number,
    checked: boolean
}

export type UpsertMessageParam = {
    participantUUID: string,
    message: string
}
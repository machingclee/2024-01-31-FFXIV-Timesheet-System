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

export type TimeSlot = {
    weeklyId: string,
    days: Day[]
}

export type Event = {
    id: string,
    title: string,
    firstOption: { option: number }
}

export type Selection = {
    participantId: number,
    timeAvailableOptionId: number
}

export type Participant = {
    frontendUUID: string,
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
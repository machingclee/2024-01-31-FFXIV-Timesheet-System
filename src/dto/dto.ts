export type CreateTimeSlotParam = {
    email: string,
    name: string,
    timeZone: string,
    startDate: string
}

export type TimeSlot = {
    weeklyId: string,
    days: {
        orderWithinWeek: number,
        options: {
            id: number,
            timeslotDailyId: number,
            option: number
        }[]
    }[]
}

export type Event = {
    id: string,
    title: string,
    firstOption: { option: number }
}
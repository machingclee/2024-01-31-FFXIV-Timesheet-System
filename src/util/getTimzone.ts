const getTimezone = () => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz;
}

export default getTimezone;
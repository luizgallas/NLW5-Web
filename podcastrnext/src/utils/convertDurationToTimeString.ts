export function convertDurationToTimeString(duration: number): string {
    const hoursInSeconds = 3600

    const hours = Math.floor(duration / hoursInSeconds)
    const minutes = Math.floor((duration % hoursInSeconds) / 60)
    const seconds = duration % 60

    const formatedDuration = [hours, minutes, seconds]
        .map(unit => String(unit).padStart(2, '0'))
        .join(':')

    return formatedDuration
}
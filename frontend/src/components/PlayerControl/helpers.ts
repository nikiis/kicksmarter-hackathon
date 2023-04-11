const convertSecondsToMinutes = (timeInSeconds: number): number => {
    const minutes = timeInSeconds / 60;
    const roundedMinutes = Math.round(minutes * 100) / 100; // round to 2 decimal places
    return roundedMinutes;
};

const toGameDisplayTime = (timeInSeconds: number): string => {
    const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${zeroPad(minutes, 2)}:${zeroPad(seconds, 2)}`;
};

export { convertSecondsToMinutes, toGameDisplayTime };

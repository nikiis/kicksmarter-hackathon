const convertSecondsToMinutes = (timeInSeconds: number): number => {
    const minutes = timeInSeconds / 60;
    const roundedMinutes = Math.round(minutes * 100) / 100; // round to 2 decimal places
    return roundedMinutes;
};

export { convertSecondsToMinutes };

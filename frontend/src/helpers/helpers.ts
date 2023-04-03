export const convertUnixTimeToDate = (unixTime: number): string => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date(unixTime);
    const dayOfWeek = daysOfWeek[date.getUTCDay()];
    const dateOfMonth = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${dayOfWeek}, ${dateOfMonth}/${month}/${year} ${formattedHours}:${formattedMinutes}`;
};

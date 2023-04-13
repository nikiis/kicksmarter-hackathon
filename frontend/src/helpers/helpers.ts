const convertUnixTimeToDate = (unixTime: number): string => {
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

const getTypeFromGameDescription = (description: string): string => {
    const pattern = /^([A-Z]+-[A-Z]+)\s-\s([A-Z]+-[A-Z]+)\s:\s\d{4}-\d{1,2}-\d{1,2}$/;
    const matches = description.match(pattern);

    if (!matches) return '';

    return `${matches[1]}-${matches[2]}`;
};

export { convertUnixTimeToDate, getTypeFromGameDescription };

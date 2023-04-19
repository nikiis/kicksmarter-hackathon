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

const getMonthYearFromUnixTime = (unixTime: number): string => {
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const date = new Date(unixTime);
    const month = months[date.getMonth()];
    const year = date.getUTCFullYear();

    return `${month} ${year}`;
};

const getTypeFromGameDescription = (description: string): string => {
    const pattern = /^([A-Z]+-[A-Z]+)\s-\s([A-Z]+-[A-Z]+)\s:\s\d{4}-\d{1,2}-\d{1,2}$/;
    const matches = description.match(pattern);

    if (!matches) return '';

    return `${matches[1]}-${matches[2]}`;
};

const splitName = (name = '') => {
    const [firstName, ...lastName] = name.split(' ').filter(Boolean);
    return {
        firstName: firstName,
        lastName: lastName.join(' '),
    };
};

export { convertUnixTimeToDate, getTypeFromGameDescription, getMonthYearFromUnixTime, splitName };

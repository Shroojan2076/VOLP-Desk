export function parseVOLPDateTime(datetime) {
    if (!datetime) return null;

    const parts = datetime.trim().split(/\s+/);

    if (parts.length !== 3) {
        throw new Error(`Invalid VOLP date format: ${datetime}`);
    }

    const [date, time, period] = parts;

    const [day, month, year] = date.split("/").map(Number);
    let [hours, minutes] = time.split(":").map(Number);

    if (
        !Number.isInteger(day) ||
        !Number.isInteger(month) ||
        !Number.isInteger(year) ||
        !Number.isInteger(hours) ||
        !Number.isInteger(minutes) ||
        day < 1 || day > 31 ||
        month < 1 || month > 12 ||
        hours < 1 || hours > 12 ||
        minutes < 0 || minutes > 59
    ) {
        throw new Error(`Invalid VOLP date: ${datetime}`);
    }

    const upperPeriod = period.toUpperCase();
    if (upperPeriod !== "AM" && upperPeriod !== "PM") {
        throw new Error(`Invalid AM/PM value: ${period}`);
    }

    let h24 = hours % 12;
    if (upperPeriod === "PM") {
        h24 += 12;
    }

    // Construct ISO string with explicit Indian Standard Time (+05:30) offset
    // so it is parsed deterministically into UTC across all server environments
    const pad = (n) => String(n).padStart(2, "0");
    const isoString = `${year}-${pad(month)}-${pad(day)}T${pad(h24)}:${pad(minutes)}:00+05:30`;
    const new_date = new Date(isoString);

    if (isNaN(new_date.getTime())) {
        throw new Error(`Invalid date: ${datetime}`);
    }

    return new_date;
}

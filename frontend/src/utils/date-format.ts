// frontend/src/utils/date-format.ts

// Converts a UTC ISO string (from backend) to a YYYY-MM-DDTHH:MM string in the specified timezone for datetime-local input
export function formatUtcIsoToDatetimeLocalInput(
  isoString: string | undefined,
  timeZone: string = 'Asia/Karachi'
): string {
  if (!isoString) return '';
  const date = new Date(isoString);

  // Use Intl.DateTimeFormat to get timezone-aware components
  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23', // Ensure 24-hour format
    timeZone: timeZone,
  });

  const parts = formatter.formatToParts(date);
  const getPart = (type: Intl.DateTimeFormatPartTypes) => parts.find(p => p.type === type)?.value;

  const year = getPart('year');
  const month = getPart('month');
  const day = getPart('day');
  const hour = getPart('hour');
  const minute = getPart('minute');

  // Intl.DateTimeFormat might return '24' for midnight, which datetime-local doesn't like.
  // It expects '00' for midnight.
  const formattedHour = hour === '24' ? '00' : hour;

  return `${year}-${month}-${day}T${formattedHour}:${minute}`;
}

// Converts a YYYY-MM-DDTHH:MM string (from datetime-local input, assumed to be in the user's local timezone)
// to a UTC ISO string for the backend.
export function parseDatetimeLocalInputToUtcIso(
  datetimeLocalString: string | undefined,
): string | undefined {
  if (!datetimeLocalString) return undefined;

  // Create a Date object from the datetime-local string.
  // When a 'YYYY-MM-DDTHH:MM' string is passed to new Date(),
  // it is interpreted as local time if no timezone offset is provided.
  const localDate = new Date(datetimeLocalString);

  if (isNaN(localDate.getTime())) {
    // Invalid date
    return undefined;
  }

  // toISOString() converts the date to UTC ISO format,
  // based on the localDate's interpreted local time.
  return localDate.toISOString();
}

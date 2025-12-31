// frontend/src/utils/date-format.ts

const ISLAMABAD_OFFSET_HOURS = 5; // PKT is UTC+5

// Converts a UTC ISO string to YYYY-MM-DDTHH:MM in Islamabad time
export function formatUtcIsoToDatetimeLocalInput(
  isoString: string | undefined
): string {
  if (!isoString) return '';
  
  try {
    // Ensure the string has 'Z' to be parsed as UTC
    const utcIsoString = isoString.endsWith('Z') ? isoString : isoString + 'Z';
    const utcDate = new Date(utcIsoString);
    if (isNaN(utcDate.getTime())) return '';

    // Add 5 hours to convert UTC to Islamabad time
    const islamabadTime = new Date(utcDate.getTime() + ISLAMABAD_OFFSET_HOURS * 60 * 60 * 1000);
    
    // Format as YYYY-MM-DDTHH:MM
    const year = islamabadTime.getUTCFullYear();
    const month = String(islamabadTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(islamabadTime.getUTCDate()).padStart(2, '0');
    const hours = String(islamabadTime.getUTCHours()).padStart(2, '0');
    const minutes = String(islamabadTime.getUTCMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

// Converts YYYY-MM-DDTHH:MM (treated as Islamabad time) to UTC ISO string
export function parseDatetimeLocalInputToUtcIso(
  datetimeLocalString: string | undefined
): string | undefined {
  if (!datetimeLocalString) return undefined;

  try {
    const [datePart, timePart] = datetimeLocalString.split('T');
    if (!datePart || !timePart) return undefined;

    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);

    // Create a date treating the input as Islamabad time
    // We do this by creating a UTC date and then subtracting 5 hours
    const islamabadDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
    const utcDate = new Date(islamabadDate.getTime() - ISLAMABAD_OFFSET_HOURS * 60 * 60 * 1000);

    if (isNaN(utcDate.getTime())) return undefined;

    return utcDate.toISOString();
  } catch (error) {
    console.error('Error parsing date:', error);
    return undefined;
  }
}

// Format UTC ISO string for display in Islamabad timezone
export function formatUtcIsoForDisplay(isoString: string | undefined): string {
  if (!isoString) return '';
  
  try {
    // Ensure the string has 'Z' to be parsed as UTC
    const utcIsoString = isoString.endsWith('Z') ? isoString : isoString + 'Z';
    const utcDate = new Date(utcIsoString);
    if (isNaN(utcDate.getTime())) return '';

    // Add 5 hours to get Islamabad time
    const islamabadTime = new Date(utcDate.getTime() + ISLAMABAD_OFFSET_HOURS * 60 * 60 * 1000);
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const month = months[islamabadTime.getUTCMonth()];
    const day = islamabadTime.getUTCDate();
    const year = islamabadTime.getUTCFullYear();
    let hours = islamabadTime.getUTCHours();
    const minutes = String(islamabadTime.getUTCMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return `${month} ${day}, ${year}, ${hours}:${minutes} ${ampm}`;
  } catch (error) {
    console.error('Error formatting date for display:', error);
    return '';
  }
}
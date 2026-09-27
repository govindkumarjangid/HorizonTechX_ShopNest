/**
 * Formats a date string or timestamp into clean, readable format
 * Example: "2026-09-27T10:30:00Z" -> "27 Sep, 2026"
 */
export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  };

  return new Intl.DateTimeFormat('en-IN', options).format(date);
};

export default formatDate;

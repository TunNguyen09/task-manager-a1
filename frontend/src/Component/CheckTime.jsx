export default function CheckTime({ time }) {
  if (!time) return "No deadline";

  const dbdate = new Date(time);
  const today = new Date();

  dbdate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = Math.ceil((dbdate - today) / msPerDay) + 1;

  if (Number.isNaN(dbdate.getTime())) return "Invalid date";
  if (daysLeft < 0) return "Date has already passed";
  if (daysLeft === 0) return "Today!!!";
  return `${daysLeft} days remaining`;
}
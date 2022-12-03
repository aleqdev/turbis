export function formatDate(c: Date): string {
  return `${c.getDate()}.${c.getMonth()+1}.${c.getFullYear()}`;
}

export function formatDateDiff(arrive: Date, deparure: Date): string {
  const diffInMs = deparure.getTime() - arrive.getTime()
  return `${Math.round(diffInMs / (1000 * 60 * 60 * 24))}/${Math.round(diffInMs / (1000 * 60 * 60 * 24)) - 1}`;
}

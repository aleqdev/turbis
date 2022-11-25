import City from "../interface/city";
import Person from "../interface/person";

export function formatPerson(w: Person): string {
  return `${w.surname} ${w.name[0]}. ${w.last_name[0]}. (+${w.phone_number})`;
}

export function formatCity(c: City): string {
  return `${c.region!.country!.name}, ${c.region!.name}, ${c.name}`;
}

export function formatDate(c: Date): string {
  return `${c.getDate()}.${c.getMonth()+1}.${c.getFullYear()}`;
}

export function formatDateDiff(arrive: Date, deparure: Date): string {
  const diffInMs = deparure.getTime() - arrive.getTime()
  return `${Math.round(diffInMs / (1000 * 60 * 60 * 24))}/${Math.round(diffInMs / (1000 * 60 * 60 * 24)) - 1}`;
}

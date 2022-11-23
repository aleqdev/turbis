import City from "../interface/city";
import Person from "../interface/person";

export function formatPerson(w: Person): string {
  return `${w.surname} ${w.name[0]}. ${w.last_name[0]}. (+${w.phone_number})`;
}

export function formatCity(c: City): string {
  return `${c.region!.country!.name}, ${c.region!.name}, ${c.name}`;
}

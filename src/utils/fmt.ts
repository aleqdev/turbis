import { CityJoinedFetch } from "../interface/city";
import { HotelJoinedFetch } from "../interface/hotel";
import { WorkerJoinedFetch } from "../interface/worker";

export function formatWorker(w: WorkerJoinedFetch): string {
  return `${w.surname} ${w.name[0]}. ${w.last_name[0]}. (+${w.phone_number})`;
}

export function formatHotelOwner(w: HotelJoinedFetch): string {
  return `${w.owner_surname} ${w.owner_name[0]}. ${w.owner_last_name[0]}. (+${w.owner_phone_number})`;
}

export function formatCity(c: CityJoinedFetch): string {
  return `${c.country_name} ${c.region_name} ${c.name}`;
}

export function formatHotelCity(c: HotelJoinedFetch): string {
  return `${c.country_name} ${c.region_name} ${c.city_name}`;
}
import City from "../interface/city";
import Person from "../interface/person";
import Client from "../interface/client";
import Tour from "../interface/tour";
import TourOrderPaymentType from "../interface/tour_order_payment_type";
import TourOrder from "../interface/tour_order";
import TourOrderTourEntry from "../interface/tour_order_entry";

export function formatPerson(w: Person): string {
  return `${w.surname} ${w.name[0]}. ${w.last_name[0]}. (+${w.phone_number})`;
}

export function formatClient(w: Client): string {
  return `${w.person?.surname} ${w.person?.name[0]}. ${w.person?.last_name[0]}. (+${w.person?.phone_number})`;
}

export function formatCity(c: City): string {
  return `${c.region!.country!.name}, ${c.region!.name}, ${c.name}`;
}

export function formatTour(c: Tour): string {
  return `${c.hotel?.name}, г.${c.hotel?.city?.name} (${c.cost} руб., ${formatDateDiff(c.arrival_date, c.departure_date)} д/н)`;
}

export function formatDate(c: Date): string {
  return `${c.getDate()}.${c.getMonth()+1}.${c.getFullYear()}`;
}

export function formatDateDiff(arrive: Date, deparure: Date): string {
  const diffInMs = deparure.getTime() - arrive.getTime()
  return `${Math.round(diffInMs / (1000 * 60 * 60 * 24))}/${Math.round(diffInMs / (1000 * 60 * 60 * 24)) - 1}`;
}

export function formatTourOrderPaymentType(type: TourOrderPaymentType): string {
  return `${type.name}`;
}

export function formatTourOrderTourEntryFirst(e: TourOrderTourEntry): string {
  let desc = `${e.tour.hotel?.name} ${e.tour.hotel?.city?.name}`;
  let descShort = desc.slice(0, 20);
  if (descShort !== desc) {
    descShort += "...";
  }

  return `${descShort}, (с ${formatDate(e.tour.arrival_date)} по ${formatDate(e.tour.departure_date)})`;
}

export function formatTourOrderTourEntrySecond(e: TourOrderTourEntry): string {
  return `${e.peopleCount} чел. по ${e.price} руб. = ${e.peopleCount * e.price} руб.`;
}

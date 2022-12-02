import Tour from "./tour";

export type TourOrderTourEntry = {
  tour: Tour,
  price: number,
  peopleCount: number,
  id?: number
};

export default TourOrderTourEntry;

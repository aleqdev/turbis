import ClientType from "./client_type"
import Person from "./person"

export type Client = {
  id: number,
  type_id: number,
  person_id: number,
  type?: ClientType,
  person?: Person
}

export default Client;

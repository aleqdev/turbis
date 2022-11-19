
export interface Worker {
    id: number,
    name: string,
    surname: string,
    last_name: string,
    phone_number: string,
    email: string,
    role_id: number
}

export interface WorkerJoinedFetch extends Worker {
    role_name: string
}

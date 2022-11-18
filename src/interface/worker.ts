
export type Worker = {
    id: number,
    name: string,
    surname: string,
    last_name: string,
    phone_number: string,
    email: string,
    role_id: number
}

export type WorkerJoinedFetch = Worker & {
    role_name: string
}

export interface CreateUsersBody {
    Body: {
        name: string,
        email: string,
        password: string
    }
}

export interface DeleteUserBody {
    Params: {
        id: string
    }
}
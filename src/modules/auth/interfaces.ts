export interface Register {
    Body: {
        name: string,
        email: string,
        password: string
    }
}

export interface Login {
    Body: {
        email: string,
        password: string
    }
}
export interface ForgetPassword {
    Body: {
        email: string
    }
}

export interface Reset {
    Querystring: {
        email: string
        token: string
    },
    Body: {
        password: string
    }
}
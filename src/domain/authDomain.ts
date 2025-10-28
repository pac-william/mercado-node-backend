export class CreateUserResponse {
    constructor(
        public created_at: string,
        public email: string,
        public email_verified: boolean,
        public identities: Identity[],
        public name: string,
        public nickname: string,
        public picture: string,
        public updated_at: string,
        public user_id: string,
    ) { }
}

export class Identity {
    constructor(
        public connection: string,
        public user_id: string,
        public provider: string,
        public isSocial: boolean,
    ) { }
}

export class GetTokenResponse {
    constructor(
        public access_token: string,
        public expires_in: number,
        public token_type: string,
        public scope?: string,
        public id_token?: string,
    ) { }
}

export class CreateUserResponseDTO {
    constructor(
        public created_at: string,
        public email: string,
        public email_verified: boolean,
        public identities: Identity[],
        public name: string,
        public nickname: string,
        public picture: string,
        public updated_at: string,
        public user_id: string,
    ) { }
}

export class GetTokenResponseDTO {
    constructor(
        public access_token: string,
        public expires_in: number,
        public token_type: string,
        public scope?: string,
        public id_token?: string,
    ) { }
}

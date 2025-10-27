export class Address {
    constructor(
        public id: string,
        public userId: string,
        public name: string,
        public street: string,
        public number: string,
        public neighborhood: string,
        public city: string,
        public state: string,
        public zipCode: string,
        public complement?: string | null,
        public isFavorite: boolean = false,
        public isActive: boolean = true,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date(),
    ) { }
}

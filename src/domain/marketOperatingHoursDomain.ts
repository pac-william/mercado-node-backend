export class MarketOperatingHours {
    constructor(
        public id: string,
        public marketId: string,
        public dayOfWeek: number | null,
        public startTime: string,
        public endTime: string,
        public isHoliday: boolean,
        public holidayDate: Date | null,
        public isClosed: boolean,
        public createdAt: Date,
        public updatedAt: Date,
    ) { }
}


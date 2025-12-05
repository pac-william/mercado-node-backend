export class PaymentSettings {
    constructor(
        public id: string,
        public marketId: string,
        public acceptsCreditCard: boolean,
        public acceptsDebitCard: boolean,
        public acceptsPix: boolean,
        public acceptsCash: boolean,
        public acceptsMealVoucher: boolean,
        public acceptsFoodVoucher: boolean,
        public pixKey: string | null,
        public pixKeyType: string | null,
        public pixMerchantName: string | null,
        public pixMerchantCity: string | null,
        public pixMerchantZipCode: string | null,
        public isActive: boolean,
        public createdAt: Date,
        public updatedAt: Date,
    ) { }
}

export class PixQRCode {
    constructor(
        public qrCode: string, // String PIX (EMV)
        public qrCodeImage: string, // Base64 da imagem do QR Code
        public amount: number,
        public description: string | null,
        public pixKey: string,
        public pixKeyType: string,
    ) { }
}


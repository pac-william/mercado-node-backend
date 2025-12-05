import QRCode from 'qrcode';

/**
 * Gera a string PIX (EMV) para pagamento
 * Formato baseado no padrão EMV QR Code
 */
export function generatePixString(
    pixKey: string,
    pixKeyType: string,
    amount: number,
    merchantName: string,
    merchantCity: string,
    description?: string,
    orderId?: string
): string {
    // Mapeia o tipo de chave para o ID do campo
    const keyTypeMap: Record<string, string> = {
        'CPF': '01',
        'CNPJ': '02',
        'EMAIL': '03',
        'PHONE': '04',
        'RANDOM_KEY': '05'
    };

    const keyTypeId = keyTypeMap[pixKeyType] || '05';
    
    // Formata o valor (sem separador de milhar, com 2 casas decimais)
    const formattedAmount = amount.toFixed(2).replace('.', '');
    
    // Monta os campos EMV
    const fields: string[] = [];
    
    // Payload Format Indicator (obrigatório)
    fields.push('000201');
    
    // Merchant Account Information
    let merchantInfo = '26'; // ID do campo
    let merchantData = '';
    
    // GUI (Global Unique Identifier) - sempre 0014br.gov.bcb.pix
    merchantData += '0014br.gov.bcb.pix';
    
    // Chave PIX
    merchantData += `01${String(pixKey.length).padStart(2, '0')}${pixKey}`;
    
    // Descrição (opcional)
    if (description) {
        merchantData += `02${String(description.length).padStart(2, '0')}${description}`;
    }
    
    // ID da transação (opcional)
    if (orderId) {
        merchantData += `05${String(orderId.length).padStart(2, '0')}${orderId}`;
    }
    
    merchantInfo += String(merchantData.length).padStart(2, '0') + merchantData;
    fields.push(merchantInfo);
    
    // Merchant Category Code (opcional, mas recomendado)
    fields.push('52040000'); // 5204 = código genérico
    
    // Transaction Currency (BRL = 986)
    fields.push('5303986');
    
    // Transaction Amount
    fields.push(`54${String(formattedAmount.length).padStart(2, '0')}${formattedAmount}`);
    
    // Country Code (BR = 076)
    fields.push('5802BR');
    
    // Merchant Name
    fields.push(`59${String(merchantName.length).padStart(2, '0')}${merchantName}`);
    
    // Merchant City
    fields.push(`60${String(merchantCity.length).padStart(2, '0')}${merchantCity}`);
    
    // Additional Data Field Template (opcional)
    if (orderId) {
        fields.push(`62${String(orderId.length + 4).padStart(2, '0')}05${String(orderId.length).padStart(2, '0')}${orderId}`);
    }
    
    // CRC16 (checksum)
    const payload = fields.join('');
    const crc = calculateCRC16(payload);
    const finalPayload = payload + '6304' + crc;
    
    return finalPayload;
}

/**
 * Calcula CRC16 para validação do QR Code PIX
 */
function calculateCRC16(data: string): string {
    const polynomial = 0x1021;
    let crc = 0xFFFF;
    
    for (let i = 0; i < data.length; i++) {
        crc ^= (data.charCodeAt(i) << 8);
        for (let j = 0; j < 8; j++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ polynomial;
            } else {
                crc <<= 1;
            }
            crc &= 0xFFFF;
        }
    }
    
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Gera a imagem do QR Code em Base64
 */
export async function generateQRCodeImage(pixString: string): Promise<string> {
    try {
        const qrCodeImage = await QRCode.toDataURL(pixString, {
            errorCorrectionLevel: 'M',
            type: 'image/png',
            width: 300,
            margin: 1,
        });
        return qrCodeImage;
    } catch (error) {
        throw new Error('Erro ao gerar imagem do QR Code: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
}


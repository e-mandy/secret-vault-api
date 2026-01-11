import qrcode from 'qrcode';
import { authenticator } from 'otplib';

export const generateQRCode = async (email, secret) => {
    const uri = authenticator.keyuri(email, 'ACTIVATION_2FA', secret);

    return await qrcode.toDataURL(uri);
}
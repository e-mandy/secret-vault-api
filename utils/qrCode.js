import qrcode from 'qrcode';
import { authenticator } from 'otplib';

const generateQRCode = (email, secret) => {
    const uri = authenticator.keyuri(email, 'ACTIVATION_2FA', secret);

    return qrcode.toDataURL(uri);
}
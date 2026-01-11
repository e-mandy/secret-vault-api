import { authenticator } from 'otplib';

// Pour que lors de la vérification de code à 6 chiffres, on accorde 30 sec en avant et en arrière pour le calcul en fonction du temps.
authenticator.options = { window: 1 };

export const generateSecret = async () => {
    return authenticator.generateSecret();
}

export const verifyCode = (token, secret) => {
    return authenticator.check(token, secret);
}
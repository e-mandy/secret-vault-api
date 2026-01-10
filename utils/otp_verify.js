import { authenticator } from "otplib"

export const verifyOTP = (token, secret) => {
    return authenticator.verify({
        token,
        secret
    });
}
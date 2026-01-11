import { authenticator } from "otplib"

export const verifyOTP = (token, secret) => {
    return authenticator.check(token, secret);
}
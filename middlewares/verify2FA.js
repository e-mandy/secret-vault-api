const verify2FA = (req, res, next) => {
    const isValid = req.user.TwoFAActivate;

    if(!isValid) return res.status(403).json({
        code: 403,
        message: "Two Factor Authentication not passed"
    });

    next();
}
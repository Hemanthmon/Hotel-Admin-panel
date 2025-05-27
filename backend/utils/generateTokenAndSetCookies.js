import jwt from "jsonwebtoken";

export const generateTokenAndSetCookies = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction, //uses https in production
        sameSite: isProduction ? "none" : "lax", //cross-site cookies in production
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return token;
}
import db from "../models/index.js"
import jwt from "jsonwebtoken"

export const authenticationToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"]
        if (!authHeader || typeof authHeader !== "string") {
            return res.status(401).json({ message: "Không tìm thấy Authorization header" })
        }

        const parts = authHeader.split(" ")
        const token = parts[1]

        if (!token) {
            return res.status(401).json({ message: "Không tìm thấy accesstoken" })
        }

        // Xác thực token 
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, decodeUser) => {
            if (error) {
                console.log(error)
                return res.status(403).json({ message: "Access token hết hạn hoặc không đúng" })
            }

            let user = await db.User.findOne({
                where: { id: decodeUser.id },
                attributes: {
                    exclude: ["password_hash"]
                },
                include: [{ model: db.Role, as: 'role' }]
            })

            if (!user) {
                return res.status(404).json({ message: "Người dùng không tồn tại." })
            }

            if (decodeUser.tokenVersion !== user.tokenVersion) {
                return res.status(401).json({ message: "Token has been revoked" })
            }

            req.user = user
            next();
        })
    } catch (error) {
        console.error("Lỗi khi xác minh JWT trong authMiddleware", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}
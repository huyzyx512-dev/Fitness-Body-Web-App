import db from "../../models/index.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import dotenv from "dotenv"

dotenv.config();

const ACCESS_TOKEN_TTL = "15m"
const REFRESH_TOKEN_TTL = 14 * 14 * 60 * 60 * 1000

export const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        // validate input
        if (!email || !password || !name) {
            return res.status(400).json({ message: "Không thể thiếu email, password, name trong quá trình đăng ký tài khoản" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 kí tự" })
        }

        if (name.length < 3) return res.status(400).json({ message: "Tên phải có ít nhất 3 kí tự" })

        // check email is existed
        const isExistEmail = await db.User.findOne({ where: { email } })
        if (isExistEmail) {
            return res.status(409).json({ message: "Email đã tồn tại" })
        }
        // hash_password
        const password_hash = await bcrypt.hash(password, 10)

        // insert into db
        await db.User.create({
            email,
            password_hash,
            name
        })

        return res.sendStatus(204);
    } catch (error) {
        console.log("Lỗi trong quá trình register: ", error)
        return res.status(500).json({ message: "Lỗi hệ thống" })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Không thể thiếu email, password" })

        const user = await db.User.findOne({ where: { email }, raw: true, nest: true })
        if (!user) {
            return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" })
        }
        const isCheckPass = await bcrypt.compare(password, user.password_hash)

        if (!isCheckPass) {
            return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" })
        }

        const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL })

        const refreshToken = crypto.randomBytes(64).toString('hex')

        await db.RefreshToken.create({
            token: refreshToken,
            expiryAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
            userId: user.id
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: REFRESH_TOKEN_TTL
        })

        return res.status(200).json({
            message: `User ${user.name} logged in!`,
            accessToken
        });
    } catch (error) {
        console.log("Lỗi trong quá trình login: ", error)
        return res.status(500).json({ message: "Lỗi hệ thống" })
    }
}

export const logout = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;

        if (token) {
            await db.RefreshToken.destroy({
                where: {
                    token
                }
            })
        }
        // Delete cookie
        res.clearCookie("refreshToken");

        return res.sendStatus(204)
    } catch (error) {
        console.log("Lỗi trong quá trình logout: ", error)
        return res.status(500).json({ message: "Lỗi hệ thống" })
    }
}

export const refreshToken = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken

        if (!token) {
            return res.status(401).json({ message: "Token don't exist" })
        }

        const session = await db.RefreshToken.findOne({
            where: { token }
        })

        if (!session) {
            return res.status(403).json({ message: "Token không hợp lệ hoặc hết hạn" })
        }

        const isExpired = session.expiryDate < Date.now()

        if (isExpired) return res.status(403).json({ message: "Token đã hết hạn" })

        const newAccessToken = jwt.sign(
            { id: session.userId },
            process.env.ACCESS_TOKEN_SECRET,
            ACCESS_TOKEN_TTL
        )

        return res.status(200).json({ newAccessToken })
    } catch (error) {
        console.log("Lỗi trong quá trình refresh token: ", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}
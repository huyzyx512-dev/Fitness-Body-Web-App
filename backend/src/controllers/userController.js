import db from "../models/index.js"

export const getUser = async (req, res) => {
    const user = req.user

    return res.status(200).json({ user })
}
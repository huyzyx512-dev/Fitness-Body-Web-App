import db from "../models/index.js"

export const getUser = async (req, res) => {
    const user = req.user

    return res.status(200).json({ user })
}

export const updateUser = async (req, res) => {
    try {
        const user = req.user
        const userId = user?.id

        if (!userId) {
            return res.status(401).json({ message: "Không xác thực được người dùng" })
        }

        const { name, weight, height, gender, date_of_birth } = req.body || {}

        const updates = {}
        if (name !== undefined) updates.name = String(name)
        if (weight !== undefined && weight !== '') updates.weight = Number(weight)
        if (height !== undefined && height !== '') updates.height = Number(height)
        if (gender !== undefined && gender !== '') {
            const allowed = new Set(['male', 'female', 'other'])
            if (!allowed.has(gender)) {
                return res.status(400).json({ message: "Giới tính không hợp lệ" })
            }
            updates.gender = gender
        }
        if (date_of_birth !== undefined && date_of_birth !== '') updates.date_of_birth = date_of_birth

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "Không có dữ liệu để cập nhật" })
        }

        await db.User.update(updates, { where: { id: userId } })

        const updatedUser = await db.User.findOne({
            where: { id: userId },
            attributes: { exclude: ['password_hash'] },
            include: [{ model: db.Role, as: 'role' }],
        })

        return res.status(200).json({ user: updatedUser })
    } catch (error) {
        console.error("Lỗi updateUser:", error)
        return res.status(500).json({ message: "Lỗi hệ thống" })
    }
}
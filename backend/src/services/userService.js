import db from "../../models/index.js";

class UserService {
    static async patchUser(userId) {
        const affectedRows = await db.User.update(
            { tokenVersion: 1 },
            { where: { id: userId } }
        );
        return affectedRows;
    }
}

export default UserService
import db from "../models/index.js";

class UserService {
  static async incrementTokenVersion(userId) {
    await db.User.increment({ tokenVersion: 1 }, { where: { id: userId } });
  }
}

export default UserService;

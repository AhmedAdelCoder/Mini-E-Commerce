import User from "../models/User.js";

/**
 * Return all users (admin only) — never exposes password field.
 */
export const getAllUsersService = async ({ page = 1, limit = 50 } = {}) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(),
  ]);

  return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
};


export const getUserByIdService = async (id) => {
  const user = await User.findById(id).select("-password").lean();
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

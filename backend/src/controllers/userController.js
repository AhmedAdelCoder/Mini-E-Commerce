import { getAllUsersService, getUserByIdService } from "../services/userService.js";


export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const result = await getAllUsersService({ page: Number(page), limit: Number(limit) });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};


export const getUserById = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

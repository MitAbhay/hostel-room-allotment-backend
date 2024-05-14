import UserModel from "./user.model.js";

export const createUser = (user) => new UserModel(user).save();
export const updateUser = (email, user) => UserModel.updateOne({ email }, user);
export const getUserByEmail = (email) => UserModel.findOne({ email });
export const getUserByReg = (reg) => UserModel.findOne({ registrationNumber: reg, status: "verified", roomNumber: {$ne: null} });
export const getUserById = (id) => UserModel.findOne({ _id: id });
export const getUserByRoomNum = (num) => UserModel.find({ roomNumber: num, status: "verified" });
export const getAllUsers = ()=> UserModel.find({}).sort({createdAt: 1});
export const getAllStudents = (gender) => {
  return UserModel.find({role: "student", status: "pending", gender })
      .sort({
          updatedAt: 1,
      })
};
export const getAllNormalStudents = () => {
  return UserModel.find({role: "student", fullName: null })
      .sort({
          createdAt: 1,
      })
};

export const getUserTypeCounts = (role, search) => {
    const query = [
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ];
    const countList = UserModel.aggregate(query);
    const queryTotalCount = {};
    if (role) {
      queryTotalCount.role = role;
    }
    if (search) {
      queryTotalCount.$or = [
        {
          userName: {
            $regex: search.trim(),
            $options: 'i',
          },
        },
        {
          email: {
            $regex: search.trim(),
            $options: 'i',
          },
        },
      ];
    }
    const totalCount = UserModel.countDocuments(queryTotalCount);
    return Promise.all([countList, totalCount]);
  };
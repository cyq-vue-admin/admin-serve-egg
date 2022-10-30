module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    userName: { type: String, required: true }, // 用户名
    email: { type: String, required: true }, // 邮箱
    password: { type: String, select: false, required: true }, // 密码 (select: false 忽略查询)
    avatar: { type: String, default: null }, // 头像
    role: { type: Array, require: true },
    createdAt: { type: Date, default: Date.now }, // 创建时间
    updatedAt: { type: Date, default: Date.now }, // 更新时间
  });

  return mongoose.model('User', UserSchema);
};


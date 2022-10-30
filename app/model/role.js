module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const RoleSchema = new Schema({
    roleName: { type: String, required: true }, // 角色名称
    roleLabel: { type: String, required: true }, // 角色标识
    permissionList: { type: Array, required: true }, // 权限列表
    createdAt: { type: Date, default: Date.now }, // 创建时间
    updatedAt: { type: Date, default: Date.now }, // 更新时间
  });

  return mongoose.model('Role', RoleSchema);
};


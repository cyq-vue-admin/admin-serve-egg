const Service = require('egg').Service;
class RoleService extends Service {
  get Role() {
    return this.app.model.Role;
  }
  async findByRoleName(roleName) {
    const roleInfo = await this.Role.findOne({ roleName });
    return roleInfo;
  }

  async findByRoleLabel(roleLabel) {
    const roleInfo = await this.Role.findOne({ roleLabel });
    return roleInfo;
  }
  async createRole(data) {
    const role = new this.Role(data);
    await role.save();
    return role;
  }

  async updateRole(data) {
    return await this.Role.findByIdAndUpdate(data._id, data, {
      new: true, // 返回更新后的数据（否则返回之前的数据）
    });
  }
}

module.exports = RoleService;

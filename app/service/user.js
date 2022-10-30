const Service = require('egg').Service;
const jwt = require('jsonwebtoken');
class UserService extends Service {
  get User() {
    return this.app.model.User;
  }
  async findByUserName(userName) {
    const userInfo = await this.User.findOne({ userName });
    return userInfo;
  }

  async findByEmail(email) {
    const userInfo = await this.User.findOne({ email }).select('+password');
    return userInfo;
  }

  async createUser(data) {
    data.password = this.ctx.helper.md5(data.password);
    const user = new this.User(data);
    await user.save();
    return user;
  }

  async createToken(data) {
    return jwt.sign(data, this.app.config.jwt.secret, {
      expiresIn: this.app.config.jwt.expiresIn,
    });
  }

  async verifyToken(token) {
    return jwt.verify(token, this.app.config.jwt.secret);
  }

  async updateUser(data) {
    if (data.password) {
      data.password = this.ctx.helper.md5(data.password);
    }

    return await this.User.findByIdAndUpdate(data._id, data, {
      new: true, // 返回更新后的数据（否则返回之前的数据）
    });
  }
}

module.exports = UserService;

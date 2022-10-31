'use strict';

const Controller = require('egg').Controller;
class UserController extends Controller {
  // 创建用户
  async create() {
    const { ctx } = this;
    const body = ctx.request.body;
    const UserService = this.service.user;
    ctx.validate({
      userName: { type: 'string', required: true },
      email: { type: 'email', required: true },
      password: { type: 'string', required: true },
    });
    if (await UserService.findByUserName(body.userName)) {
      ctx.throw(422, '用户名已存在');
    }
    if (await UserService.findByEmail(body.email)) {
      ctx.throw(422, '邮箱已存在');
    }
    const user = await UserService.createUser(body); // 保存数据
    ctx.body = {
      code: 200,
      message: '创建用户成功',
      data: {
        ...ctx.helper._.pick(user, [ '_id', 'userName', 'email', 'avatar' ]),
      },
    };
  }

  // 创建admin
  async createAdmin() {
    const { ctx } = this;
    const UserService = this.service.user;
    if (await UserService.findByUserName('admin')) {
      ctx.throw(422, '用户名已存在');
    }
    if (await UserService.findByEmail('admin@qq.com')) {
      ctx.throw(422, '邮箱已存在');
    }
    const user = await UserService.createUser({
      userName: 'admin',
      password: 'admin',
      email: 'admin@qq.com',
      role: [],
    }); // 保存数据
    ctx.body = {
      code: 200,
      message: '创建admin成功',
      data: {
        ...ctx.helper._.pick(user, [ '_id', 'userName', 'email', 'avatar' ]),
      },
    };
  }

  // 登录
  async login() {
    const { ctx, app } = this;
    const body = ctx.request.body;
    const UserService = this.service.user;
    // ctx.validate(
    //   {
    //     email: { type: 'email', required: true },
    //     password: { type: 'string', required: true },
    //   },
    //   body
    // );
    console.log(body);
    const errors = app.validator.validate(
      {
        email: { type: 'email', required: true },
        password: { type: 'string', required: true },
      },
      ctx.request.body
    );
    console.log(errors);
    if (errors !== undefined) {
      ctx.throw(444, errors[0]);
    }
    const user = await UserService.findByEmail(body.email);
    if (!user) {
      ctx.throw(422, '用户不存在');
    }
    if (this.ctx.helper.md5(body.password) !== user.password) {
      ctx.throw(422, '密码错误');
    }
    //  生产token
    const token = await UserService.createToken({
      userId: user._id,
    });
    ctx.body = {
      status: 200,
      code: 200,
      message: '登陆成功',
      data: {
        ...ctx.helper._.pick(user, [ '_id', 'userName', 'email', 'role' ]),
        token,
      },
    };
  }

  // 获取用户信息findById
  async getUserById() {
    const { ctx } = this;
    const { userId } = ctx.query;
    const { User } = this.app.model;
    if (!userId) {
      ctx.body = {
        code: 500,
        message: '参数错误',
        data: {},
      };
    }
    const user = await User.findById(userId);
    ctx.body = {
      code: 200,
      message: '获取用户信息成功',
      data: {
        user,
      },
    };
  }

  async getCurrentUser() {
    const { ctx } = this;
    const user = ctx.user;
    const { Role } = this.app.model;

    const roleList = await Role.find();
    let permissionList = [];
    for (const i of user.role) {
      const res = roleList.find(ele => ele._id.toString() === i);
      permissionList = [ ...permissionList, ...res.permissionList ];
    }

    ctx.body = {
      code: 200,
      data: {
        ...ctx.helper._.pick(user, [
          '_id',
          'userName',
          'email',
          'avatar',
          'role',
          'createdAt',
          'updatedAt',
        ]),
        permissions: Array.from(new Set(permissionList)),
      },
    };
  }

  // 用户列表查询
  async getUsers() {
    const { ctx } = this;
    let { pageNum = 1, pageSize = 10 } = ctx.query;
    pageNum = Number.parseInt(pageNum);
    pageSize = Number.parseInt(pageSize);
    const { User, Role } = this.app.model;

    const roleList = await Role.find();

    const userList = await User.find()
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize);

    for (const item of userList) {
      for (const i of item.role) {
        // console.log(i);
        item.role = roleList.find(ele => ele._id.toString() === i);
      }
    }
    const total = await User.countDocuments();
    ctx.body = {
      code: 200,
      message: '用户列表查询成功',
      data: {
        userList,
        total,
        pageNum,
        pageSize,
      },
    };
  }

  //   删除用户
  async deleteUser() {
    const { ctx } = this;
    const { userId } = ctx.request.body;
    const { User } = this.app.model;
    if (!userId) {
      ctx.body = {
        code: 500,
        message: '参数错误',
        data: {},
      };
    }
    const user = await User.findById(userId);
    await user.remove();
    ctx.body = {
      code: 200,
      message: '删除成功',
      data: {},
    };
  }

  //   修改用户信息
  async updateUser() {
    const { ctx } = this;
    const body = ctx.request.body;
    const UserService = this.service.user;
    const userByName = await UserService.findByUserName(body.userName);
    if (userByName && userByName._id.toString() !== body._id) {
      ctx.throw(422, '用户名已存在');
    }
    const userByEmail = await UserService.findByEmail(body.email);
    if (userByEmail && userByEmail._id.toString() !== body._id) {
      ctx.throw(422, '邮箱已存在');
    }
    const user = await UserService.updateUser(body); // 保存数据
    ctx.body = {
      code: 200,
      message: '修改成功',
      data: {
        user,
      },
    };
  }
}

module.exports = UserController;

'use strict';

const Controller = require('egg').Controller;

class RoleController extends Controller {
  // 创建角色
  async create() {
    const { ctx } = this;
    const body = ctx.request.body;
    const RoleService = this.service.role;
    ctx.validate({
      roleName: { type: 'string', required: true },
      roleLabel: { type: 'string', required: true },
      permissionList: { type: 'array', required: true },
    });
    if (await RoleService.findByRoleName(body.roleName)) {
      ctx.throw(20000, '角色名称已存在');
    }
    if (await RoleService.findByRoleLabel(body.roleLabel)) {
      ctx.throw(20000, '角色标识已存在');
    }
    const role = await RoleService.createRole(body); // 保存数据
    ctx.body = {
      code: 200,
      message: '创建角色成功',
      data: {
        role,
      },
    };
  }

  // 获取用户信息findById
  async getRoleById() {
    const { ctx } = this;
    const { roleId } = ctx.query;
    const { Role } = this.app.model;
    if (!roleId) {
      ctx.throw(20001, '参数错误');
    }
    const role = await Role.findById(roleId);
    if (!role) {
      ctx.throw(20002, '获取失败');
    }
    ctx.body = {
      code: 200,
      message: '获取角色信息成功',
      data: {
        role,
      },
    };
  }

  // 角色列表查询
  async getRoles() {
    const { ctx } = this;
    const { Role } = this.app.model;

    let { pageNum = 1, pageSize = 10, isAll } = ctx.query;
    if (isAll) {
      const roleList = await Role.find();
      ctx.body = {
        code: 200,
        message: '角色列表查询成功',
        data: {
          roleList,
        },
      };
    } else {
      pageNum = Number.parseInt(pageNum);
      pageSize = Number.parseInt(pageSize);

      const roleList = await Role.find()
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize);
      const total = await Role.countDocuments();
      ctx.body = {
        code: 200,
        message: '角色列表查询成功',
        data: {
          roleList,
          total,
          pageNum,
          pageSize,
        },
      };
    }
  }

  //   删除用户
  async deleteRole() {
    const { ctx } = this;
    const { roleId } = ctx.request.body;
    const { Role } = this.app.model;
    if (!roleId) {
      ctx.body = {
        code: 500,
        message: '参数错误',
        data: {},
      };
      return;
    }
    const role = await Role.findById(roleId);
    await role.remove();
    ctx.body = {
      code: 200,
      message: '删除成功',
      data: {},
    };
  }

  //   修改用户信息
  async updateRole() {
    const { ctx } = this;
    const body = ctx.request.body;
    const RoleService = this.service.role;
    const userByName = await RoleService.findByRoleName(body.roleName);
    if (userByName && userByName._id.toString() !== body._id) {
      ctx.throw(422, '角色名称已存在');
    }
    const userByLabel = await RoleService.findByRoleLabel(body.roleLabel);
    if (userByLabel && userByLabel._id.toString() !== body._id) {
      ctx.throw(422, '角色标识已存在');
    }
    const role = await RoleService.updateRole(body); // 保存数据
    ctx.body = {
      code: 200,
      message: '修改成功',
      data: {
        role,
      },
    };
  }
}

module.exports = RoleController;

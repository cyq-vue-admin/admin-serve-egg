'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const auth = app.middleware.auth();
  router.prefix('/api/v1'); // 前缀
  router.get('/', controller.home.index);
  router.post('/login', controller.user.login); // 登陆
  router.post('/user/create', auth, controller.user.create); // 创建用户
  router.get('/users', auth, controller.user.getUsers); // 用户列表
  router.get('/user', auth, controller.user.getUserById); // 用户findById
  router.get('/getCurrentUser', auth, controller.user.getCurrentUser); // 当前用户信息
  router.post('/user/del', auth, controller.user.deleteUser); // 删除用户
  router.post('/user/update', auth, controller.user.updateUser); // 修改用户

  router.post('/role/create', auth, controller.role.create); // 创建角色
  router.get('/roles', auth, controller.role.getRoles); // 角色列表
  router.get('/role', auth, controller.role.getRoleById); // 角色findById
  router.post('/role/del', auth, controller.role.deleteRole); // 删除角色
  router.post('/role/update', auth, controller.role.updateRole); // 修改角色

  router.post('/file', controller.file.uploadFile); // 文件上传
};

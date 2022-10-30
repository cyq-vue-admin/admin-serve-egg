module.exports = (options = { required: true }) => {
  return async (ctx, next) => {
    // 1.获取token
    let token = ctx.headers.authorization;
    token = token ? token.split(' ')[1] : null;
    if (token) {
      try {
        const data = await ctx.service.user.verifyToken(token);
        ctx.user = await ctx.model.User.findById(data.userId);
      } catch (error) {
        ctx.throw(401, '未授权');
      }
    } else if (options.required) {
      ctx.throw(401, '未授权');
    }

    await next();
  };
};

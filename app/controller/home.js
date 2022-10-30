'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    // ctx.throw('aaa', 404, { a: 123 });
    // ctx.throw(401, 'access_denied', { user: 'user' });
    ctx.body = 'hi, egg';
  }
}

module.exports = HomeController;

/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1658219348179_3462';

  // add your middleware config here
  config.middleware = [
    'errorHandler',
  ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  // config.cluster = {
  //   listen: {
  //     path: '',
  //     port: 7051,
  //     hostname: '127.0.0.1', // 0.0.0.0
  //   },
  // };


  config.cors = {
    origin: [ 'http://localhost:8080' ], // 跨任何域
    credentials: true, // 开启认证
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS', // 被允许的请求方式
  };


  // 数据库连接
  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/admin-serve-egg',
      options: {
        useUnifiedTopology: true,
      },
      plugins: [],
    },
  };


  // 安全配置
  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [ 'http://127.0.0.1:8080', 'http://120.48.74.178:8080' ],
  };

  config.jwt = {
    secret: 'cyqcyqcyqcyq',
    expiresIn: '1d',
  };

  config.multipart = {
    mode: 'stream', // 对应文件类型
    fileSize: '50mb', // 文件大小
    fileExtensions: [
      '.txt',
    ],
  };

  config.static = {
    prefix: '/public/',
    dir: [ path.join(appInfo.baseDir, 'app/public') ],
  };


  return {
    ...config,
    ...userConfig,
  };
};

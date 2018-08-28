import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: 'dashboard',
    icon: 'dashboard',
    path: 'dashboard',
    children: [
      {
        name: '分析页',
        path: 'analysis',
      },
    ],
  },
  {
    name: '表单页',
    icon: 'form',
    path: 'form',
    children: [
      {
        name: '基础表单',
        path: 'basic-form',
      },
    ],
  },
  {
    name: '商品管理',
    icon: 'table',
    path: 'goods',
    children: [
      {
        name: '商品列表',
        path: 'list',
        authority: 'admin',
      },
    ],
  },
  {
    name: '订单管理',
    icon: 'table',
    path: 'target',
    children: [
      {
        name: '订单列表',
        path: 'list',
        authority: 'admin',
      },
    ],
  },
  {
    name: '商户管理',
    icon: 'table',
    path: 'shop',
    children: [
      {
        name: '商户列表',
        path: 'list',
        authority: 'admin',
      },
    ],
  },
  {
    name: '用户管理',
    icon: 'table',
    path: 'custom',
    children: [
      {
        name: '用户列表',
        path: 'list',
        authority: 'admin',
      },
    ],
  },
  {
    name: '账户中心',
    icon: 'table',
    path: 'account',
    children: [
      {
        name: '账号列表',
        path: 'list',
        authority: 'admin',
      },
      {
        name: '角色管理',
        path: 'role',
        authority: 'admin',
      },
      {
        name: '权限管理',
        path: 'rolepermission',
        authority: 'admin',
      },
    ],
  },
  {
    name: '店铺运营',
    icon: 'table',
    path: 'runtime',
  },
  {
    name: '详情页',
    icon: 'profile',
    path: 'profile',
    children: [
      {
        name: '基础详情页',
        path: 'basic',
        authority: 'admin',
      },
    ],
  },
  {
    name: '结果页',
    icon: 'check-circle-o',
    path: 'result',
    children: [
      {
        name: '成功',
        path: 'success',
      },
      {
        name: '失败',
        path: 'fail',
      },
    ],
  },
  {
    name: '异常页',
    icon: 'warning',
    path: 'exception',
    children: [
      {
        name: '403',
        path: '403',
      },
      {
        name: '404',
        path: '404',
      },
      {
        name: '500',
        path: '500',
      },
      {
        name: '触发异常',
        path: 'trigger',
        hideInMenu: true,
      },
    ],
  },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    authority: 'guest',
    children: [
      {
        name: '登录',
        path: 'login',
      },
      {
        name: '注册',
        path: 'register',
      },
      {
        name: '注册结果',
        path: 'register-result',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);

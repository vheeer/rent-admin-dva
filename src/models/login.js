import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { login, logout } from '../services/user';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { getPageQuery } from '../utils/utils';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      console.log('payload----------------', payload);
      const response = yield call(login, payload);
      console.log('response', response);
      const { data } = response;
      yield put({
        type: 'changeLoginStatus',
        payload: data,
      });
      // Login successfully
      if (data.status === 'ok') {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          // 如果参数中有login字符，登录后跳到首页
          if (redirectUrlParams.hash.indexOf('login') > -1) {
            window.location.href = '/';
            return;
          }
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },
    *logout(_, { call, put }) {
      alert('models/login  logout 退出')
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
      const response = yield call(logout);
      console.log('退出结果', response);
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    setState(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    }
  },
};

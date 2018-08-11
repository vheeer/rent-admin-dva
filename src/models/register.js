import { fakeRegister } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { register } from '../services/user';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(fakeRegister, payload);
      yield put({
        type: 'registerHandle', 
        payload: response,
      });
    },
    *register({ payload }, { call, put }) {
      const response = yield call(register, payload);
      console.log('register', response);
      if (response.status === 'ok') {
        yield put({
          type: 'registerHandle', 
          payload: response,
        });
      } else if (response.status === 'fail' && response.errno === 'ER_DUP_ENTRY') {
        yield put({
          type: 'changeStatus',
          status: 'dup'
        })
      }
    }
  },
  reducers: {
    registerHandle(state, { payload }) {
      setAuthority('admin');
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
      };
    },
    clearStatus(state) {
      return {
        ...state,
        status: undefined
      }
    },
    changeStatus(state, { status }) {
      return {
        ...state,
        status
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      const listener = location => {
        if (location.pathname === '/user/register-result') {
          alert(3);
          dispatch({
            type: 'clearStatus'
          })
        }
      }
      history.listen(listener);
    }
  }
};

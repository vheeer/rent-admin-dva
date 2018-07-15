import { queryRule, removeRule, addRule } from '../services/api';
import { select, match, create, update, drop } from '../services/curd';

export default {
  namespace: 'rule',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      console.log(payload);
      const result = yield call(select, payload);
      // 处理传回数据
      const pagination = {
        total: result.data.count,
        pageSize: result.data.pageSize,
        current: result.data.currentPage,
      };
      const list = result.data.data;
      list.forEach(item => (item['key'] = item['id']));
      const response = { list, pagination };
      console.log('response', response);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *match({ payload }, { call, put }) {
      console.log(payload);
      const result = yield call(match, payload);
      // 处理传回数据
      const pagination = {
        total: result.data.count,
        pageSize: result.data.pageSize,
        current: result.data.currentPage,
      };
      const list = result.data.data;
      list.forEach(item => (item['key'] = item['id']));
      const response = { list, pagination };
      console.log('response', response);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(create, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *drop({ payload, callback }, { call, put }) {
      const response = yield call(drop, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};

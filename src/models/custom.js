import { queryRule, removeRule, addRule, execute } from '../services/api';
import { select, match, create, createmul, updatemul, drop } from '../services/curd';

export default {
  namespace: 'custom',

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
      if (!result)
        return;
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
      if (!result)
        return;
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
      // 添加、修改单条记录，添加多条记录
      const { _count, ...payload_rest } = payload;
      console.log('add payload ', payload);
      let service;
      if (_count === 1) {
        service = create;
      } else if(typeof _count === "number" && _count > 1) {
        service = createmul;
      } else if(typeof _count === "undefined") {
        service = create;
      }
      const response = yield call(service, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *updatemul({ payload, callback }, { call, put }) {
      console.log('add payload ', payload);
      const response = yield call(updatemul, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *drop({ payload, callback }, { call, put }) {
      console.log("payload drop", payload)
      const response = yield call(drop, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *execute({ payload, callback }, { call, put }) {
      console.log('add payload ', payload);
      const response = yield call(execute, payload);
      console.log('execute res', response)
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

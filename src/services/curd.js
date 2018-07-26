import request from '../utils/request';
import { objToParams } from '../utils/mini_utils';
import config from '../config';

export function query() {
  return request('/api/users');
}

/**
 * select request
 * params { select_description: { id, page, offset, order }, model }
 * @return {Promise} []
 */
export function select({ model, ...params }) {
  const params_str = objToParams(params);

  let url = config.host + '/' + model + '/select?' + params_str;

  return request(url, {
    method: 'get',
    headers: {
      withCredentials: true,
    },
  });
}
/**
 * match request
 * params { select_description: { id, page, offset, order }, model }
 * @return {Promise} []
 */
export function match({ model, ...params }) {
  const params_str = objToParams(params);

  let url = config.host + '/' + model + '/match?' + params_str;

  return request(url);
}
/**
 * readColumn request
 * params readDesc
 * @return {Promise} []
 */
export function readColumn({ model, ...params }) {
  // const params_str = objToParams(params);

  let url = config.host + '/' + model + '/readcolumn';

  return request(url, {
    method: 'get',
  });
}

/**
 * create request
 * params { values, model }
 * @return {Promise} []
 */
export function create({ model, ...params }) {
  const params_str = objToParams(params);

  let url = config.host + '/' + model + '/create';

  return request(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: params_str,
  });
}

/**
 * create request
 * params { values, model }
 * @return {Promise} []
 */
export function createmul({ model, ...params }) {
  const params_str = objToParams(params);

  let url = config.host + '/' + model + '/createmul';

  return request(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: params_str,
  });
}

/**
 * update request
 * params { values, model }
 * @return {Promise} []
 */
export function updatemul({ model, ...params }) {
  const params_str = objToParams(params);

  let url = config.host + '/' + model + '/update';

  return request(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: params_str,
  });
}

/**
 * delete request
 * params { values, model }
 * @return {Promise} []
 */
export function drop({ model, ...params }) {
  const params_str = objToParams(params);

  let url = config.host + '/' + model + '/delete';

  return request(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: params_str,
  });
}

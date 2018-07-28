import request from '../utils/request';
import { objToParams } from '../utils/utils'
import config from '../config';

export async function query() {
  return request(config.host + '/api/users');
}

export async function getuser() {
  return request(config.host + '/account/getuser');
}

export async function login(params) {
  return request(config.host + '/account/login', {
    method: 'POST',
    body: objToParams(params)
  });
}
export async function logout(params) {
  return request(config.host + '/account/logout', {
    method: 'POST',
    body: objToParams(params)
  });
}
export async function register(params) {
  return request(config.host + '/account/register', {
    method: 'POST',
    body: objToParams(params)
  });
}
import React from 'react';
import { Button } from 'antd';
import { Link } from 'dva/router';
import Result from 'components/Result';
import styles from './RegisterResult.less';

const actions = (
  <div className={styles.actions}>
  {/*
    <a href="">
      <Button size="large" type="primary">
        查看邮箱
      </Button>
    </a>
  */}
    <Link to="/">
      <Button size="large" type="primary">返回首页</Button>
    </Link>
  </div>
);

export default ({ location }) => (
  <Result
    className={styles.registerResult}
    type="success"
    title={
      <div className={styles.title}>
        你的账户：
        {location.state ? location.state.account : ''} 注册成功
      </div>
    }
    description={(() => {
      return ''
    })()}
    actions={actions}
    style={{ marginTop: 56 }}
  />
);

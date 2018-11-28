import * as React from 'react';
import { Link } from 'react-router-dom';

import { Button } from 'antd';

import styles from './ServerError.module.less';

const ServerError: React.SFC<{}> = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>500</h1>
      <div className={styles.desc}>서버 에러가 발생했습니다.</div>
      <Link to="/">
        <Button className={styles.backButton} type="primary" size="large">
          돌아가기
        </Button>
      </Link>
    </div>
  );
};

export default ServerError;

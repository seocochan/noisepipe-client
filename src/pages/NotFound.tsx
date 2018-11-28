import * as React from 'react';
import { Link } from 'react-router-dom';

import { Button } from 'antd';

import styles from './NotFound.module.less';

const NotFound: React.SFC<{}> = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <div className={styles.desc}>찾을 수 없는 페이지입니다.</div>
      <Link to="/">
        <Button className={styles.backButton} type="primary" size="large">
          돌아가기
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;

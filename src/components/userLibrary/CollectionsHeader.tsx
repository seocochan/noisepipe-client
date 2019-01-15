import * as React from 'react';

import { Button } from 'antd';

import styles from './CollectionsHeader.module.less';

interface Props {
  count: number;
}

const CollectionsHeader: React.SFC<Props> = ({ count }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{count}개의 컬렉션</h2>
      <Button icon="plus" shape="circle" size="large" />
    </div>
  );
};

export default CollectionsHeader;

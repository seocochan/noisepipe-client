import * as React from 'react';

import { Button } from 'antd';

import styles from './CollectionsHeader.module.less';

interface Props {
  count: number;
  isFormVisible: boolean;
  handleClick: () => void;
}

const CollectionsHeader: React.SFC<Props> = ({
  count,
  isFormVisible,
  handleClick
}) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{count}개의 컬렉션</h2>
      <Button
        icon={isFormVisible ? 'close' : 'plus'}
        type={isFormVisible ? 'primary' : 'default'}
        shape="circle"
        size="large"
        onClick={handleClick}
      />
    </div>
  );
};

export default CollectionsHeader;

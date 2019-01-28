import * as React from 'react';

import { Button } from 'antd';

import styles from './ListHeader.module.less';

interface Props {
  count: number;
  name: string;
  hasAddButton?: boolean;
  isFormVisible?: boolean;
  handleClick?: () => void;
}

const ListHeader: React.SFC<Props> = ({
  count,
  name,
  hasAddButton = false,
  isFormVisible = false,
  handleClick
}) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {count}개의 {name}
      </h2>
      {hasAddButton && (
        <Button
          icon={isFormVisible ? 'close' : 'plus'}
          type={isFormVisible ? 'primary' : 'default'}
          shape="circle"
          size="large"
          onClick={handleClick}
        />
      )}
    </div>
  );
};

export default ListHeader;

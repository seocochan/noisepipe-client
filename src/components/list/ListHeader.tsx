import * as React from 'react';

import { Button } from 'antd';

import styles from './ListHeader.module.less';

interface Props {
  q?: string;
  username?: string;
  count: number;
  unit?: string;
  name: string;
  hasAddButton?: boolean;
  isFormVisible?: boolean;
  handleClick?: () => void;
}

const ListHeader: React.FC<Props> = ({
  q,
  username,
  count,
  unit = '개',
  name,
  hasAddButton = false,
  isFormVisible = false,
  handleClick
}) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {q && (
          <span>
            <span className={styles.highlight}>'{q}'</span>에 해당하는{' '}
          </span>
        )}
        {username && (
          <span>
            <span className={styles.highlight}>{username}</span>님이 생성한{' '}
          </span>
        )}
        {count}
        {unit}의 {name}
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

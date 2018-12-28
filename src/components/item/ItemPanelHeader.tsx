import * as React from 'react';

import { Icon, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';

import styles from './ItemPanelHeader.module.less';

interface Props {
  tab: 'viewer' | 'editor';
  handleClose: (e: React.MouseEvent) => void;
  handleTabChange: (e: RadioChangeEvent) => void;
}

const ItemPanelHeader: React.SFC<Props> = ({
  tab,
  handleClose,
  handleTabChange
}) => {
  return (
    <div className={styles.header}>
      <a className={styles.iconButton} onClick={handleClose}>
        <Icon type="arrow-left" />
      </a>
      <div className={styles.innerMenu}>
        <Radio.Group size="small" value={tab} onChange={handleTabChange}>
          <Radio.Button value="viewer">보기</Radio.Button>
          <Radio.Button value="editor">수정</Radio.Button>
        </Radio.Group>
      </div>
      <div className={styles.innerMenu}>
        <a className={styles.iconButton}>
          <Icon type="delete" />
        </a>
      </div>
    </div>
  );
};

export default ItemPanelHeader;

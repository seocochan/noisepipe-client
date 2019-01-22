import * as React from 'react';

import { Icon, Popconfirm, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import { Tab } from 'types';

import styles from './ItemPanelHeader.module.less';

interface Props {
  tab: Tab;
  showEditables: boolean;
  handleClose: (e: React.MouseEvent) => void;
  handleTabChange: (e: RadioChangeEvent) => void;
  handleRemove: (e: React.MouseEvent) => void;
}

const ItemPanelHeader: React.SFC<Props> = ({
  tab,
  showEditables,
  handleClose,
  handleTabChange,
  handleRemove
}) => {
  return (
    <div className={styles.header}>
      <a className={styles.iconButton} onClick={handleClose}>
        <Icon type="arrow-left" />
      </a>
      {showEditables && (
        <>
          <div className={styles.innerMenu}>
            <Radio.Group size="small" value={tab} onChange={handleTabChange}>
              <Radio.Button value={Tab.Viewer}>보기</Radio.Button>
              <Radio.Button value={Tab.Editor}>수정</Radio.Button>
            </Radio.Group>
          </div>
          <div className={styles.innerMenu}>
            <Popconfirm title={'삭제할까요?'} onConfirm={handleRemove}>
              <a className={styles.iconButton}>
                <Icon type="delete" />
              </a>
            </Popconfirm>
          </div>
        </>
      )}
    </div>
  );
};

export default ItemPanelHeader;

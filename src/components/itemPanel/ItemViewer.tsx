import * as React from 'react';

import { Tag } from 'antd';
import { Player } from 'components/player';
import * as moment from 'moment';
import { IItemResponse } from 'payloads';

import styles from './ItemViewer.module.less';

interface Props {
  item: IItemResponse;
}

const ItemViewer: React.SFC<Props> = ({ item }) => {
  return (
    <div>
      <div className={styles.contentHeader}>
        <div className={styles.tag}>
          {['태그1', '태그2'].map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <div>
          <span>{moment(item.createdAt).format('ll')}</span>
        </div>
      </div>
      <h1>{item.title}</h1>
      <div className={styles.playerWrapper}>
        <Player />
      </div>
      <article>{item.description}</article>
    </div>
  );
};

export default ItemViewer;

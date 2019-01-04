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
          {item.tags.map(tag => (
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
      <article className={styles.description}>
        {item.description ? item.description : <i>{'설명이 없습니다'}</i>}
      </article>
    </div>
  );
};

export default ItemViewer;

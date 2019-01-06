import * as React from 'react';

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
        <div className={styles.tags}>
          {item.tags.map((tag, index) => (
            <span key={index}>{`#${tag}`}</span>
          ))}
        </div>
        <div>
          <span>{moment(item.createdAt).format('ll')}</span>
        </div>
      </div>
      <h1>{item.title}</h1>
      <div className={styles.playerWrapper}>
        <p>player</p>
      </div>
      <article className={styles.description}>
        {item.description ? item.description : <i>{'설명이 없습니다'}</i>}
      </article>
    </div>
  );
};

export default ItemViewer;

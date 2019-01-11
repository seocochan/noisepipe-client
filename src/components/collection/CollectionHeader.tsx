import * as React from 'react';
import { Link } from 'react-router-dom';

import { Button, Dropdown, Menu } from 'antd';
import { LoadingIndicator } from 'components/common';
import * as moment from 'moment';
import { ICollectionResponse } from 'payloads';

import styles from './CollectionHeader.module.less';

interface Props {
  collection: ICollectionResponse | null;
  collectionPlayButton: React.ReactChild;
  itemCount: number;
  itemAddForm: React.ReactChild;
}

const menu = (
  <Menu>
    <Menu.Item key="0">
      <a>수정</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a>삭제</a>
    </Menu.Item>
  </Menu>
);

const CollectionHead: React.SFC<Props> = ({
  collection,
  collectionPlayButton,
  itemCount,
  itemAddForm
}) => {
  if (!collection) {
    return <LoadingIndicator />;
  }

  const { title, description, tags, createdBy, createdAt } = collection;
  return (
    <div className={styles.header}>
      <div className={styles.topContainer}>
        <div className={styles.tags}>
          {tags.map((tag, index) => (
            <span key={index}>{`#${tag}`}</span>
          ))}
        </div>
        <Button className={styles.bookmarkButton} icon="book" shape="circle" />
        <Dropdown overlay={menu} trigger={['click']}>
          <Button icon="ellipsis" shape="circle" />
        </Dropdown>
      </div>
      <div className={styles.titleSection}>
        {collectionPlayButton}
        <h1>{title}</h1>
      </div>
      <div className={styles.metadata}>
        <span>
          <Link to={`/${createdBy.username}`}>{createdBy.username}</Link> 제작
        </span>
        <span>·</span>
        <span>{moment(createdAt).fromNow()}</span>
      </div>
      <article className={styles.description}>{description}</article>
      <div>{itemAddForm}</div>
    </div>
  );
};

export default CollectionHead;

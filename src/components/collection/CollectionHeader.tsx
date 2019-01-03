import * as React from 'react';
import { Link } from 'react-router-dom';

import { Button, Dropdown, Menu, Tag } from 'antd';
import { LoadingIndicator } from 'components/common';
import * as moment from 'moment';
import { ICollectionResponse } from 'payloads';

import styles from './CollectionHeader.module.less';

interface Props {
  collection: ICollectionResponse | null;
  itemCount: number;
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

const CollectionHead: React.SFC<Props> = ({ collection, itemCount }) => {
  if (!collection) {
    return <LoadingIndicator />;
  }

  const { title, description, tags, createdBy, createdAt } = collection;
  return (
    <div className={styles.header}>
      <div className={styles.tag}>
        {tags.map(tag => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>{title}</h1>
        <Button className={styles.bookmarkButton} icon="book" shape="circle" />
        <Dropdown overlay={menu} trigger={['click']}>
          <Button icon="ellipsis" shape="circle" />
        </Dropdown>
      </div>
      <article className={styles.description}>{description}</article>
      <div className={styles.metadata}>
        <span>
          제작자 <Link to={`/${createdBy.username}`}>{createdBy.username}</Link>
        </span>
        <span>·</span>
        <span>아이템 {itemCount}개</span>
        <span>·</span>
        <span>{moment(createdAt).fromNow()}</span>
      </div>
      <div>
        <Button icon="caret-right">재생</Button>
      </div>
    </div>
  );
};

export default CollectionHead;

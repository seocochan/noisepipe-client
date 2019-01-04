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
        <div className={styles.tag}>
          {tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <Button className={styles.bookmarkButton} icon="book" shape="circle" />
        <Dropdown overlay={menu} trigger={['click']}>
          <Button icon="ellipsis" shape="circle" />
        </Dropdown>
      </div>
      <div className={styles.titleSection}>
        <Button icon="caret-right" shape="circle" />
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

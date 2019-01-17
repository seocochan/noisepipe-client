import * as React from 'react';
import { Link } from 'react-router-dom';

import { Badge, Button, Dropdown, Menu } from 'antd';
import { LoadingIndicator } from 'components/common';
import * as moment from 'moment';
import { ICollectionResponse } from 'payloads';

import styles from './CollectionHeader.module.less';

interface Props {
  collection: ICollectionResponse | null;
  collectionPlayButton: React.ReactChild;
  itemAddForm: React.ReactChild;
  onClickEdit: () => void;
  onClickRemove: () => void;
  onCreateBookmark: (collectionId: number) => void;
  onRemoveBookmark: (collectionId: number) => void;
}

const CollectionHeader: React.SFC<Props> = ({
  collection,
  collectionPlayButton,
  itemAddForm,
  onClickEdit,
  onClickRemove,
  onCreateBookmark,
  onRemoveBookmark
}) => {
  if (!collection) {
    return <LoadingIndicator />;
  }

  const menu = (
    <Menu>
      {true && (
        <Menu.Item key="edit" onClick={onClickEdit}>
          <a>수정</a>
        </Menu.Item>
      )}
      {true && (
        <Menu.Item key="remove" onClick={onClickRemove}>
          <a>삭제</a>
        </Menu.Item>
      )}
      <Menu.Item key="share">
        <a>공유</a>
      </Menu.Item>
    </Menu>
  );

  const {
    id,
    title,
    description,
    tags,
    isBookmarked,
    bookmarks,
    createdBy,
    createdAt
  } = collection;
  return (
    <div className={styles.header}>
      <div className={styles.topContainer}>
        <div className={styles.tags}>
          {tags.map((tag, index) => (
            <span key={index}>{`#${tag}`}</span>
          ))}
        </div>
        <Badge
          offset={[2, -2]}
          count={bookmarks}
          style={{
            marginRight: 16,
            backgroundColor: '#1890ff',
            zIndex: 1
          }}
        >
          <Button
            className={styles.button}
            icon="book"
            shape="circle"
            type={isBookmarked ? 'primary' : 'default'}
            onClick={() =>
              isBookmarked ? onRemoveBookmark(id) : onCreateBookmark(id)
            }
          />
        </Badge>
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

export default CollectionHeader;

import * as React from 'react';
import { Link } from 'react-router-dom';

import { Badge, Button, Dropdown, Icon, Menu, Popconfirm } from 'antd';
import { LoadingIndicator } from 'components/common';
import * as moment from 'moment';
import { ICollectionResponse } from 'payloads';

import styles from './CollectionHeader.module.less';

interface Props {
  collection: ICollectionResponse | null;
  isAuthenticated: boolean;
  isAuthor: boolean;
  collectionPlayButton: React.ReactChild;
  itemAddForm: React.ReactChild;
  onClickEdit: () => void;
  onClickRemove: () => void;
  onClickShare: (title: string, id: number) => void;
  onCreateBookmark: (collectionId: number) => void;
  onRemoveBookmark: (collectionId: number) => void;
}

const CollectionHeader: React.SFC<Props> = ({
  collection,
  isAuthenticated,
  isAuthor,
  collectionPlayButton,
  itemAddForm,
  onClickEdit,
  onClickRemove,
  onClickShare,
  onCreateBookmark,
  onRemoveBookmark
}) => {
  if (!collection) {
    return <LoadingIndicator />;
  }

  const shareMenus = (
    <Menu>
      <Menu.Item
        key="twitter"
        onClick={() => onClickShare(collection.title, collection.id)}
      >
        <Icon type="twitter" />
        트위터에 공유
      </Menu.Item>
    </Menu>
  );
  const moreMenus = (
    <Menu>
      <Menu.Item key="edit" onClick={onClickEdit}>
        수정
      </Menu.Item>
      <Menu.Item key="remove">
        <Popconfirm
          title="컬렉션과 모든 아이템이 삭제됩니다. 삭제할까요?"
          onConfirm={onClickRemove}
        >
          삭제
        </Popconfirm>
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
            className={styles.buttonLeft}
            icon="book"
            shape="circle"
            type={isBookmarked ? 'primary' : 'default'}
            onClick={() =>
              isBookmarked ? onRemoveBookmark(id) : onCreateBookmark(id)
            }
            disabled={isAuthenticated ? false : true}
          />
        </Badge>
        <Dropdown overlay={shareMenus} trigger={['click']}>
          <Button icon="share-alt" shape="circle" />
        </Dropdown>
        {isAuthor && (
          <Dropdown
            className={styles.buttonRight}
            overlay={moreMenus}
            trigger={['click']}
          >
            <Button icon="ellipsis" shape="circle" />
          </Dropdown>
        )}
      </div>
      <div className={styles.titleSection}>
        {collectionPlayButton}
        <h1>{title}</h1>
      </div>
      <div className={styles.metadata}>
        <span>
          <Link to={`/@${createdBy.username}`}>{createdBy.username}</Link> 제작
        </span>
        <span>·</span>
        <span>{moment(createdAt).fromNow()}</span>
      </div>
      <article className={styles.description}>{description}</article>
      <div style={{ minHeight: 1 }}>{isAuthor && itemAddForm}</div>
    </div>
  );
};

export default CollectionHeader;

import * as React from 'react';
import { Link } from 'react-router-dom';

import { Card, Dropdown, Icon, Menu } from 'antd';
import * as moment from 'moment';
import { ICollectionSummary } from 'payloads';

import styles from './CollectionCard.module.less';

interface Props {
  collection: ICollectionSummary;
  isOwner: boolean;
}

const CollectionCard: React.SFC<Props> = ({
  collection: { createdAt, createdBy, id, items, tags, title },
  isOwner
}) => {
  return (
    <Card
      actions={[
        <Icon key="bookmark-add" type="book" />,
        <Icon key="share" type="share-alt" />,
        <Dropdown
          key="more"
          trigger={['click']}
          overlay={
            <Menu>
              <Menu.Item key="edit" disabled={!isOwner}>
                수정
              </Menu.Item>
              <Menu.Item key="delete" disabled={!isOwner}>
                삭제
              </Menu.Item>
            </Menu>
          }
        >
          <Icon type="ellipsis" />
        </Dropdown>
      ]}
    >
      <Card.Meta
        title={
          <div className={styles.flex}>
            <span>
              <Link to={`/@${createdBy.username}`}>{createdBy.username}</Link>
            </span>
            <h3>
              <Link className={styles.title} to={`/collections/${id}`}>
                {title}
              </Link>
            </h3>
          </div>
        }
        description={
          <div className={styles.flex}>
            <div>
              <span>{moment(createdAt).fromNow()}</span>
              <span>·</span>
              <span>{`${items}개의 아이템`}</span>
            </div>
            <div>
              {tags.map((tag, index) => (
                <span key={index} className={styles.tag}>{`#${tag}`}</span>
              ))}
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default CollectionCard;

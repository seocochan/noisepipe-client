import * as React from 'react';
import { Link } from 'react-router-dom';

import { Card, Icon } from 'antd';
import * as moment from 'moment';
import { ICollectionSummary } from 'payloads';

import styles from './CollectionCard.module.less';

interface Props {
  collection: ICollectionSummary;
}

const CollectionCard: React.SFC<Props> = ({
  collection: { createdAt, createdBy, id, items, tags, title }
}) => {
  return (
    <Card
      actions={[
        <Icon key="bookmark-add" type="book" />,
        <Icon key="share" type="share-alt" />
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
            <div className={styles.tags}>
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

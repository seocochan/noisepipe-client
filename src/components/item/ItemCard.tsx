import * as React from 'react';
import { Link } from 'react-router-dom';

import { Card, Icon } from 'antd';
import * as moment from 'moment';
import { IItemSummary } from 'payloads';

import styles from './ItemCard.module.less';

interface Props {
  item: IItemSummary;
}

const ItemCard: React.FC<Props> = ({
  item: { createdBy, title, collectionId, collectionTitle, createdAt, tags }
}) => {
  return (
    <Card>
      <Card.Meta
        title={
          <div className={styles.flex}>
            <span>
              <Link to={`/@${createdBy.username}`}>{createdBy.username}</Link>
            </span>
            <h3>
              <Link
                className={styles.title}
                to={`/collections/${collectionId}`}
              >
                {title}
              </Link>
            </h3>
            <span className={styles.collectionTitle}>
              <Icon type="database" /> {collectionTitle}
            </span>
          </div>
        }
        description={
          <div className={styles.flex}>
            <span>{moment(createdAt).fromNow()}</span>
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

export default ItemCard;

import * as React from 'react';
import { Link } from 'react-router-dom';

import { Card, Icon, message } from 'antd';
import * as moment from 'moment';
import { ICollectionSummary } from 'payloads';

import styles from './CollectionCard.module.less';

interface Props {
  collection: ICollectionSummary;
  onCreateBookmark: (collectionId: number) => Promise<void>;
  onRemoveBookmark: (collectionId: number) => Promise<void>;
}
interface State {
  isBookmarked: boolean;
}

class CollectionCard extends React.Component<Props, State> {
  public readonly state: State = {
    isBookmarked: false
  };

  private handleCreateBookmark = async (collectionId: number) => {
    const { onCreateBookmark } = this.props;
    try {
      await onCreateBookmark(collectionId);
      this.setState({ isBookmarked: true });
      message.info('북마크를 추가했습니다');
    } catch (error) {
      message.error('에러가 발생했습니다');
    }
  };
  private handleRemoveBookmark = async (collectionId: number) => {
    const { onRemoveBookmark } = this.props;
    try {
      await onRemoveBookmark(collectionId);
      this.setState({ isBookmarked: false });
      message.info('북마크를 제거했습니다');
    } catch (error) {
      message.error('에러가 발생했습니다');
    }
  };

  public render() {
    const {
      collection: { createdAt, createdBy, id, items, tags, title }
    } = this.props;
    const { isBookmarked } = this.state;

    return (
      <Card
        actions={[
          <Icon
            key="bookmark-add"
            type="book"
            theme={isBookmarked ? 'twoTone' : 'outlined'}
            onClick={() =>
              isBookmarked
                ? this.handleRemoveBookmark(id)
                : this.handleCreateBookmark(id)
            }
          />,
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
  }
}

export default CollectionCard;

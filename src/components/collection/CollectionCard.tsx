import * as React from 'react';
import { Link } from 'react-router-dom';

import { Card, Dropdown, Icon, Menu, message, Tooltip } from 'antd';
import * as moment from 'moment';
import { ICollectionSummary } from 'payloads';
import { DEFAULT_ERROR_MESSAGE } from 'values';

import styles from './CollectionCard.module.less';

interface Props {
  collection: ICollectionSummary;
  disableBookmark: boolean;
  defaultBookmarked?: boolean;
  onCreateBookmark: (collectionId: number) => Promise<void>;
  onRemoveBookmark: (collectionId: number) => Promise<void>;
}
interface State {
  isBookmarked: boolean;
}

class CollectionCard extends React.Component<Props, State> {
  public readonly state: State = {
    isBookmarked: this.props.defaultBookmarked
      ? this.props.defaultBookmarked
      : false
  };
  public getBookmarkState = () => {
    return {
      id: this.props.collection.id,
      isBookmarked: this.state.isBookmarked
    };
  };

  private handleCreateBookmark = async (collectionId: number) => {
    const { onCreateBookmark } = this.props;
    try {
      await onCreateBookmark(collectionId);
      this.setState({ isBookmarked: true });
      message.info('북마크를 추가했습니다');
    } catch (error) {
      message.error(DEFAULT_ERROR_MESSAGE);
    }
  };
  private handleRemoveBookmark = async (collectionId: number) => {
    const { onRemoveBookmark } = this.props;
    try {
      await onRemoveBookmark(collectionId);
      this.setState({ isBookmarked: false });
      message.info('북마크를 제거했습니다');
    } catch (error) {
      message.error(DEFAULT_ERROR_MESSAGE);
    }
  };
  private handleClickShare = (title: string, id: number) => {
    window.open(
      `https://twitter.com/intent/tweet?text=${title}&url=${
        process.env.REACT_APP_BASE_URL
      }/collections/${id}`,
      '_blank',
      'width=550, height=420, toolbar=no, menubar=no, scrollbars=no, resizable=no'
    );
  };
  private shareMenus = (title: string, id: number) => {
    return (
      <Menu>
        <Menu.Item
          key="twitter"
          onClick={() => this.handleClickShare(title, id)}
        >
          <Icon type="twitter" />
          트위터에 공유
        </Menu.Item>
      </Menu>
    );
  };

  public render() {
    const {
      disableBookmark,
      collection: { createdAt, createdBy, id, items, tags, title }
    } = this.props;
    const { isBookmarked } = this.state;

    return (
      <Card
        actions={[
          disableBookmark ? (
            <Tooltip title="로그인이 필요합니다">
              <Icon key="bookmark-disabled" type="book" />
            </Tooltip>
          ) : (
            <Icon
              key="bookmark-add"
              type="book"
              theme={isBookmarked ? 'twoTone' : 'outlined'}
              onClick={() =>
                isBookmarked
                  ? this.handleRemoveBookmark(id)
                  : this.handleCreateBookmark(id)
              }
            />
          ),
          <Dropdown
            key="share"
            overlay={this.shareMenus(title, id)}
            trigger={['click']}
          >
            <Icon type="share-alt" />
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

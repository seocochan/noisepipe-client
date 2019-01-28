import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { SortEndHandler } from 'react-sortable-hoc';

import { Divider, message } from 'antd';
import { CollectionForm, CollectionHeader, CollectionItems, CollectionPlayButton } from 'components/collection';
import { CommentForm, CommentHeader } from 'components/comment';
import { ItemAddForm, ItemFilterInput } from 'components/item';
import { RecursiveList } from 'components/list';
import { DummyPlayer } from 'components/player';
import { ICollectionRequest, ICommentRequest, IItemResponse } from 'payloads';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { AuthState } from 'store/modules/auth';
import { actions as collectionActions, CollectionState } from 'store/modules/collection';
import { actions as itemActions } from 'store/modules/item';
import { actions as playerActions, PlayerState } from 'store/modules/player';
import { Provider } from 'types';
import { DEFAULT_ERROR_MESSAGE } from 'values';

interface Props extends RouteComponentProps {
  auth: AuthState;
  ItemActions: typeof itemActions;
  collection: CollectionState;
  CollectionActions: typeof collectionActions;
  collectionId: number;
  player: PlayerState;
  PlayerActions: typeof playerActions;
}
interface State {
  isFormVisible: boolean;
}

class CollectionItemsContainer extends React.Component<Props, State> {
  public readonly state: State = {
    isFormVisible: false
  };

  public async componentDidMount() {
    const { collectionId, CollectionActions, history } = this.props;

    try {
      await CollectionActions.loadCollection(collectionId);
    } catch (error) {
      if (error.response.status === 500) {
        history.replace('/error');
      }
    }
    CollectionActions.loadItems(collectionId);
    CollectionActions.loadComments(collectionId);
  }
  public componentWillUnmount() {
    const { ItemActions, CollectionActions, PlayerActions } = this.props;
    ItemActions.initialize();
    CollectionActions.initialize();
    PlayerActions.initialize();
  }

  private handleSubmit = (data: ICollectionRequest) => {
    const { CollectionActions, collection } = this.props;
    CollectionActions.updateCollection(collection.collection!.id, data);
  };
  private handleRemove = async () => {
    const {
      CollectionActions,
      collection: { collection },
      history
    } = this.props;
    if (!collection) {
      return;
    }
    try {
      await CollectionActions.removeCollection(collection.id);
      history.replace(`/@${collection.createdBy.username}/collections`);
    } catch (error) {
      message.error(DEFAULT_ERROR_MESSAGE);
    }
  };
  private handleShare = (title: string, id: number) => {
    window.open(
      `https://twitter.com/intent/tweet?text=${title}&url=${
        process.env.REACT_APP_BASE_URL
      }/collections/${id}`,
      '_blank',
      'width=550, height=420, toolbar=no, menubar=no, scrollbars=no, resizable=no'
    );
  };
  private handleSortEnd: SortEndHandler = async ({ oldIndex, newIndex }) => {
    const { collection, CollectionActions } = this.props;

    if (oldIndex === newIndex || collection.items == null) {
      return;
    }
    try {
      await CollectionActions.updateItemPostion(oldIndex, newIndex);
    } catch (error) {
      console.log(error);
    }
  };
  private handleClickItem = (e: React.MouseEvent) => {
    e.preventDefault();
    const { ItemActions, collection } = this.props;
    const item =
      collection.items &&
      e.currentTarget &&
      collection.items[parseInt(e.currentTarget.id, 10)];

    ItemActions.showPanel();
    ItemActions.setItem(item);
  };
  private handleAddItem = (
    title: string,
    sourceUrl: string,
    sourceProvider: Provider
  ) => {
    const {
      CollectionActions,
      collection: { collection }
    } = this.props;
    if (!collection) {
      return;
    }
    CollectionActions.addItem(collection.id, title, sourceUrl, sourceProvider);
  };
  private playItem = (item: IItemResponse) => {
    const { PlayerActions } = this.props;
    const target = item.sourceProvider;
    PlayerActions.stopOthers(target);
    PlayerActions.setItem(target, item);
  };
  private resumeItem = (item: IItemResponse) => {
    const { PlayerActions } = this.props;
    const target = item.sourceProvider;
    PlayerActions.play(target);
  };
  private pauseItem = (item: IItemResponse) => {
    const { PlayerActions } = this.props;
    const target = item.sourceProvider;
    PlayerActions.pause(target);
  };
  private handleCreateBookmark = async (collectionId: number) => {
    const { CollectionActions } = this.props;
    try {
      await CollectionActions.createBookmark(collectionId);
      message.info('북마크를 추가했습니다');
    } catch (error) {
      message.error(DEFAULT_ERROR_MESSAGE);
    }
  };
  private handleRemoveBookmark = async (collectionId: number) => {
    const { CollectionActions } = this.props;
    try {
      await CollectionActions.removeBookmark(collectionId);
      message.info('북마크를 제거했습니다');
    } catch (error) {
      message.error(DEFAULT_ERROR_MESSAGE);
    }
  };
  private handleLoadReplies = (commentId: number) => {
    const {
      CollectionActions,
      collection: { collection }
    } = this.props;
    if (!collection) {
      return;
    }
    CollectionActions.loadReplies(collection.id, commentId);
  };
  private handleCreateComment = async (data: ICommentRequest) => {
    const {
      CollectionActions,
      collection: { collection }
    } = this.props;
    if (!collection) {
      return;
    }
    try {
      await CollectionActions.createCommentOrReply(collection.id, data);
    } catch (error) {
      throw error;
    }
  };
  private handleUpdateComment = async (
    commentId: number,
    data: ICommentRequest
  ) => {
    const { CollectionActions } = this.props;
    try {
      await CollectionActions.updateCommentOrReply(commentId, data);
    } catch (error) {
      throw error;
    }
  };
  private handleRemoveComment = async (commentId: number, replyTo?: number) => {
    const { CollectionActions } = this.props;
    try {
      await CollectionActions.removeCommentOrReply(commentId, replyTo);
    } catch (error) {
      throw error;
    }
  };

  public render(): React.ReactNode {
    const {
      auth: { currentUser },
      collection: { collection, items, comments, replies },
      player: { currentTarget },
      player,
      PlayerActions
    } = this.props;
    const { isFormVisible } = this.state;
    const playerItem =
      currentTarget && player[currentTarget].item
        ? {
            id: player[currentTarget].item!.id,
            playing: player[currentTarget].status.playing
          }
        : undefined;
    const isAuthor = currentUser
      ? currentUser.id === (collection && collection.createdBy.id)
      : false;

    return (
      <>
        {isFormVisible ? (
          <CollectionForm
            collection={
              collection
                ? {
                    title: collection.title,
                    description: collection.description,
                    tags: collection.tags
                  }
                : undefined
            }
            handleSubmit={this.handleSubmit}
            onAfterReset={() => this.setState({ isFormVisible: false })}
          />
        ) : (
          <CollectionHeader
            collection={collection}
            isAuthenticated={currentUser ? true : false}
            isAuthor={isAuthor}
            collectionPlayButton={
              <CollectionPlayButton
                isPlaying={
                  currentTarget ? player[currentTarget].status.playing : false
                }
                isSet={currentTarget ? true : false}
                onPause={() =>
                  currentTarget && PlayerActions.pause(currentTarget)
                }
                onPlay={() =>
                  items && items.length > 0 && this.playItem(items[0])
                }
                onResume={() =>
                  currentTarget && PlayerActions.play(currentTarget)
                }
              />
            }
            itemAddForm={<ItemAddForm handleAddItem={this.handleAddItem} />}
            onClickEdit={() => this.setState({ isFormVisible: true })}
            onClickRemove={this.handleRemove}
            onClickShare={this.handleShare}
            onCreateBookmark={this.handleCreateBookmark}
            onRemoveBookmark={this.handleRemoveBookmark}
          />
        )}
        <DummyPlayer />
        <Divider />
        <ItemFilterInput />
        {items && (
          <CollectionItems
            items={items}
            playerItem={playerItem}
            showDragHandle={isAuthor}
            lockToContainerEdges={true}
            onClickItem={this.handleClickItem}
            playItem={this.playItem}
            resumeItem={this.resumeItem}
            pauseItem={this.pauseItem}
            useDragHandle={true}
            onSortEnd={this.handleSortEnd}
          />
        )}
        <Divider style={{ background: 'transparent' }} />
        {collection && <CommentHeader comments={collection.comments} />}
        {currentUser && (
          <CommentForm gutterBottom={16} onSubmit={this.handleCreateComment} />
        )}
        {comments && (
          <RecursiveList
            depth={0}
            comments={comments}
            replies={replies}
            currentUser={currentUser}
            onLoad={this.handleLoadReplies}
            onCreate={this.handleCreateComment}
            onUpdate={this.handleUpdateComment}
            onRemove={this.handleRemoveComment}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = ({ auth, collection, player }: RootState) => ({
  auth,
  collection,
  player
});
const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  ItemActions: bindActionCreators(itemActions, dispatch),
  CollectionActions: bindActionCreators(collectionActions, dispatch),
  PlayerActions: bindActionCreators(playerActions, dispatch)
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CollectionItemsContainer)
);

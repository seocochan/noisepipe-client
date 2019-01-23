import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { message } from 'antd';
import { CollectionCard, CollectionsHeader } from 'components/collection';
import { LoadingIndicator } from 'components/common';
import { GridCardList, LoadMoreButton } from 'components/list';
import { ICollectionSummary } from 'payloads';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { AuthState } from 'store/modules/auth';
import { actions as collectionActions } from 'store/modules/collection';
import { actions as userLibraryActions, UserLibraryState } from 'store/modules/userLibrary';
import { DEFAULT_ERROR_MESSAGE, DEFAULT_PAGE_SIZE } from 'values';

interface Props extends RouteComponentProps {
  currentTab: string;
  tabName: string;
  username: string;
  currentUser: AuthState['currentUser'];
  bookmarks: UserLibraryState['bookmarks'];
  CollectionActions: typeof collectionActions;
  UserLibraryActions: typeof userLibraryActions;
}

class BookmarksContainer extends React.Component<Props, {}> {
  private cards: Array<CollectionCard | null> = [];

  public async componentDidMount() {
    const { username, UserLibraryActions, history } = this.props;
    try {
      await UserLibraryActions.loadBookmarkedCollections(username);
    } catch (error) {
      message.error(DEFAULT_ERROR_MESSAGE);
      history.replace('/404');
    }
  }
  public componentDidUpdate(prevProps: Props) {
    const { currentTab, tabName, username, UserLibraryActions } = this.props;
    if (currentTab !== prevProps.currentTab) {
      if (currentTab === tabName) {
        UserLibraryActions.loadBookmarkedCollections(username);
      } else {
        UserLibraryActions.initialize();
      }
    }
  }
  public componentWillUnmount() {
    const { UserLibraryActions } = this.props;
    UserLibraryActions.initialize();
  }

  private loadMore = async () => {
    let offsetId = -1;
    // find first bookmarked card from the last
    for (let i = this.cards.length - 1; i >= 0; i--) {
      if (this.cards[i] == null) {
        continue;
      }
      const { id, isBookmarked } = this.cards[i]!.getBookmarkState();
      console.log('마지막 북마크: ', id);
      if (isBookmarked) {
        offsetId = id;
        break;
      }
    }

    // if offsetId is still -1
    // get more list without offsetId (fetch from first item)
    const { UserLibraryActions, username } = this.props;
    await UserLibraryActions.loadBookmarkedCollections(
      username,
      offsetId === -1 ? undefined : offsetId,
      DEFAULT_PAGE_SIZE,
      true
    );
  };
  private handleCreateBookmark = async (collectionId: number) => {
    const { UserLibraryActions } = this.props;
    try {
      await UserLibraryActions.createBookmark(collectionId);
    } catch (error) {
      throw error;
    }
  };
  private handleRemoveBookmark = async (
    collectionId: number,
    index: number
  ) => {
    const { UserLibraryActions } = this.props;
    try {
      await UserLibraryActions.removeBookmark(collectionId, index);
    } catch (error) {
      throw error;
    }
  };

  public render(): React.ReactNode {
    const { bookmarks, username, currentUser } = this.props;

    if (!bookmarks) {
      return <LoadingIndicator />;
    }
    return (
      <>
        <CollectionsHeader count={bookmarks.totalElements} name={'북마크'} />
        <GridCardList
          collections={bookmarks.content}
          renderCard={(collection: ICollectionSummary, index: number) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              defaultBookmarked={
                currentUser ? currentUser.username === username : false
              }
              disableBookmark={currentUser ? false : true}
              onCreateBookmark={this.handleCreateBookmark}
              onRemoveBookmark={collectionId =>
                this.handleRemoveBookmark(collectionId, index)
              }
              ref={card => {
                this.cards[index] = card;
              }}
            />
          )}
          isLast={bookmarks.last}
          loadMoreButton={<LoadMoreButton loadMore={this.loadMore} />}
        />
      </>
    );
  }
}

const mapStateToProps = ({ auth, userLibrary }: RootState) => ({
  currentUser: auth.currentUser,
  bookmarks: userLibrary.bookmarks
});
const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  CollectionActions: bindActionCreators(collectionActions, dispatch),
  UserLibraryActions: bindActionCreators(userLibraryActions, dispatch)
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BookmarksContainer)
);

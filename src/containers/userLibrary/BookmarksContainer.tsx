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
    const { UserLibraryActions, bookmarks, username } = this.props;
    await UserLibraryActions.loadBookmarkedCollections(
      username,
      bookmarks!.page + 1,
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
  private handleRemoveBookmark = async (collectionId: number) => {
    const { UserLibraryActions } = this.props;
    try {
      await UserLibraryActions.removeBookmark(collectionId);
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
          renderCard={(collection: ICollectionSummary) => (
            <CollectionCard
              collection={collection}
              defaultBookmarked={
                currentUser ? currentUser.username === username : false
              }
              disableBookmark={currentUser ? false : true}
              onCreateBookmark={this.handleCreateBookmark}
              onRemoveBookmark={this.handleRemoveBookmark}
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

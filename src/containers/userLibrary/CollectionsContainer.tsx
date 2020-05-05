import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { Divider, message } from 'antd';
import { CollectionCard, CollectionForm } from 'components/collection';
import { LoadingIndicator } from 'components/common';
import { GridCardList, ListHeader, LoadMoreButton } from 'components/list';
import { ICollectionRequest, ICollectionSummary } from 'payloads';
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
  collections: UserLibraryState['collections'];
  CollectionActions: typeof collectionActions;
  UserLibraryActions: typeof userLibraryActions;
}
interface State {
  isFormVisible: boolean;
}

class CollectionsContainer extends React.Component<Props, State> {
  public readonly state: State = {
    isFormVisible: false,
  };

  public async componentDidMount() {
    const { username, UserLibraryActions, history } = this.props;
    try {
      await UserLibraryActions.loadCollections(username);
    } catch (error) {
      message.error(DEFAULT_ERROR_MESSAGE);
      history.replace('/404');
    }
  }
  public componentDidUpdate(prevProps: Props) {
    const { currentTab, tabName, username, UserLibraryActions } = this.props;
    if (currentTab !== prevProps.currentTab) {
      if (currentTab === tabName) {
        UserLibraryActions.loadCollections(username);
      } else if (prevProps.currentTab === tabName) {
        this.setState({ isFormVisible: false });
        UserLibraryActions.initialize();
      }
    }
  }
  public componentWillUnmount() {
    const { UserLibraryActions } = this.props;
    UserLibraryActions.initialize();
  }

  private getOffsetId = () => {
    const { collections } = this.props;
    return !collections ? -1 : collections.content[collections.content.length - 1].id;
  };
  private loadMore = async () => {
    const { UserLibraryActions, username } = this.props;
    const offsetId = this.getOffsetId();

    await UserLibraryActions.loadCollections(username, offsetId === -1 ? undefined : offsetId, DEFAULT_PAGE_SIZE, true);
  };
  private handleSubmit = async (collection: ICollectionRequest) => {
    const { currentUser, CollectionActions, UserLibraryActions, username } = this.props;
    if (!currentUser) {
      return;
    }
    try {
      await CollectionActions.createCollection(currentUser.username, collection);
      await UserLibraryActions.loadCollections(username);
    } catch (error) {
      message.error(DEFAULT_ERROR_MESSAGE);
    }
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
    const { collections, currentUser, username } = this.props;
    const { isFormVisible } = this.state;

    if (!collections) {
      return <LoadingIndicator />;
    }
    return (
      <>
        <ListHeader
          username={username}
          count={collections.totalElements}
          name={'컬렉션'}
          hasAddButton={currentUser ? currentUser.username === username : false}
          isFormVisible={isFormVisible}
          handleClick={() => this.setState({ isFormVisible: !isFormVisible })}
        />
        {isFormVisible && (
          <>
            <CollectionForm
              handleSubmit={this.handleSubmit}
              onAfterReset={() => this.setState({ isFormVisible: false })}
            />
            <Divider />
          </>
        )}
        <GridCardList<ICollectionSummary>
          dataSource={collections.content}
          renderCard={(collection: ICollectionSummary) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              disableBookmark={currentUser ? false : true}
              onCreateBookmark={this.handleCreateBookmark}
              onRemoveBookmark={this.handleRemoveBookmark}
            />
          )}
          isLast={collections.last}
          loadMoreButton={<LoadMoreButton loadMore={this.loadMore} />}
        />
      </>
    );
  }
}

const mapStateToProps = ({ auth, userLibrary }: RootState) => ({
  currentUser: auth.currentUser,
  collections: userLibrary.collections,
});
const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  CollectionActions: bindActionCreators(collectionActions, dispatch),
  UserLibraryActions: bindActionCreators(userLibraryActions, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CollectionsContainer));

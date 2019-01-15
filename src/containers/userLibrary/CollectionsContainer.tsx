import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { Divider, message } from 'antd';
import { CollectionCard, CollectionForm, Collections, CollectionsHeader, LoadMoreButton } from 'components/collection';
import { LoadingIndicator } from 'components/common';
import { ICollectionRequest, ICollectionSummary } from 'payloads';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { AuthState } from 'store/modules/auth';
import { actions as collectionActions } from 'store/modules/collection';
import { actions as userLibraryActions, UserLibraryState } from 'store/modules/userLibrary';
import { DEFAULT_PAGE_SIZE } from 'values';

interface Props extends RouteComponentProps {
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
    isFormVisible: false
  };

  public async componentDidMount() {
    const { username, UserLibraryActions, history } = this.props;
    try {
      await UserLibraryActions.loadCollections(username);
    } catch (error) {
      message.error('에러가 발생했습니다');
      history.replace('/404');
    }
  }
  public componentWillUnmount() {
    const { UserLibraryActions } = this.props;
    UserLibraryActions.initialize();
  }

  private loadMore = async () => {
    const { UserLibraryActions, collections, username } = this.props;
    await UserLibraryActions.loadCollections(
      username,
      collections!.page + 1,
      DEFAULT_PAGE_SIZE,
      true
    );
  };
  private handleSubmit = async (collection: ICollectionRequest) => {
    const {
      currentUser,
      CollectionActions,
      UserLibraryActions,
      username
    } = this.props;
    if (!currentUser) {
      return;
    }
    try {
      await CollectionActions.createCollection(
        currentUser.username,
        collection
      );
      await UserLibraryActions.loadCollections(username);
    } catch (error) {
      message.error('에러가 발생했습니다');
    }
  };

  public render(): React.ReactNode {
    const { collections } = this.props;
    const { isFormVisible } = this.state;

    if (!collections) {
      return <LoadingIndicator />;
    }
    return (
      <>
        <CollectionsHeader
          count={collections.totalElements}
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
        <Collections
          collections={collections.content}
          renderCard={(collection: ICollectionSummary) => (
            <CollectionCard collection={collection} />
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
  collections: userLibrary.collections
});
const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  CollectionActions: bindActionCreators(collectionActions, dispatch),
  UserLibraryActions: bindActionCreators(userLibraryActions, dispatch)
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CollectionsContainer)
);

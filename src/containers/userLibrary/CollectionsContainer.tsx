import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { CollectionCard, Collections, LoadMoreButton } from 'components/collection';
import { LoadingIndicator } from 'components/common';
import { CollectionsHeader } from 'components/userLibrary';
import { ICollectionSummary } from 'payloads';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { AuthState } from 'store/modules/auth';
import { actions as userLibraryActions, UserLibraryState } from 'store/modules/userLibrary';
import { DEFAULT_PAGE_SIZE } from 'values';

interface Props extends RouteComponentProps {
  username: string;
  currentUser: AuthState['currentUser'];
  collections: UserLibraryState['collections'];
  UserLibraryActions: typeof userLibraryActions;
}

class CollectionsContainer extends React.Component<Props, {}> {
  public async componentDidMount() {
    const { username, UserLibraryActions, history } = this.props;
    try {
      await UserLibraryActions.loadCollections(username);
    } catch (error) {
      history.replace('/404');
    }
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

  public render(): React.ReactNode {
    const { collections, currentUser } = this.props;

    if (!collections) {
      return <LoadingIndicator />;
    }
    return (
      <>
        <CollectionsHeader count={collections.totalElements} />
        <Collections
          collections={collections.content}
          renderCard={(collection: ICollectionSummary) => (
            <CollectionCard
              collection={collection}
              isOwner={
                currentUser != null &&
                collection.createdBy.id === currentUser.id
              }
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
  collections: userLibrary.collections
});
const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  UserLibraryActions: bindActionCreators(userLibraryActions, dispatch)
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CollectionsContainer)
);

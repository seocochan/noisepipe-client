import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { CollectionCard, Collections } from 'components/collection';
import { LoadingIndicator } from 'components/common';
import { ICollectionSummary } from 'payloads';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { actions as userLibraryActions, UserLibraryState } from 'store/modules/userLibrary';

interface Props extends RouteComponentProps {
  username: string;
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

  public render(): React.ReactNode {
    const { collections } = this.props;

    if (!collections) {
      return <LoadingIndicator />;
    }
    return (
      <Collections
        collections={collections.content}
        renderCard={(collection: ICollectionSummary) => (
          <CollectionCard
            collection={collection}
            isOwner={true}
          />
        )}
      />
    );
  }
}

const mapStateToProps = ({ userLibrary }: RootState) => ({
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

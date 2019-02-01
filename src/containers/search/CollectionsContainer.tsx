import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { message } from 'antd';
import { CollectionCard } from 'components/collection';
import { LoadingIndicator } from 'components/common';
import { GridCardList, ListHeader, LoadMoreButton } from 'components/list';
import { ICollectionSummary } from 'payloads';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { AuthState } from 'store/modules/auth';
import { actions as searchActions, SearchState } from 'store/modules/search';
import { DEFAULT_ERROR_MESSAGE, DEFAULT_PAGE_SIZE } from 'values';

interface Props extends RouteComponentProps {
  currentTab: string;
  tabName: string;
  q: string;
  currentUser: AuthState['currentUser'];
  collections: SearchState['collections'];
  SearchActions: typeof searchActions;
}

class CollectionsContainer extends React.Component<Props, {}> {
  public async componentDidMount() {
    const { q, SearchActions, history } = this.props;
    try {
      await SearchActions.loadCollections(q);
    } catch (error) {
      message.error(DEFAULT_ERROR_MESSAGE);
      history.replace('/404');
    }
  }
  public componentDidUpdate(prevProps: Props) {
    const { currentTab, tabName, q, SearchActions } = this.props;
    if (currentTab !== prevProps.currentTab) {
      if (currentTab === tabName) {
        SearchActions.loadCollections(q);
      } else if (prevProps.currentTab === tabName) {
        SearchActions.initialize();
      }
    } else if (currentTab === tabName && q !== prevProps.q) {
      SearchActions.loadCollections(q);
    }
  }
  public componentWillUnmount() {
    const { SearchActions } = this.props;
    SearchActions.initialize();
  }

  private loadMore = async () => {
    const { SearchActions, collections, q } = this.props;

    await SearchActions.loadCollections(
      q,
      collections!.page + 1,
      DEFAULT_PAGE_SIZE,
      true
    );
  };
  private handleCreateBookmark = async (collectionId: number) => {
    const { SearchActions } = this.props;
    try {
      await SearchActions.createBookmark(collectionId);
    } catch (error) {
      throw error;
    }
  };
  private handleRemoveBookmark = async (collectionId: number) => {
    const { SearchActions } = this.props;
    try {
      await SearchActions.removeBookmark(collectionId);
    } catch (error) {
      throw error;
    }
  };

  public render(): React.ReactNode {
    const { collections, currentUser, q } = this.props;

    if (!collections) {
      return <LoadingIndicator />;
    }
    return (
      <>
        <ListHeader q={q} count={collections.totalElements} name={'컬렉션'} />
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

const mapStateToProps = ({ auth, search }: RootState) => ({
  currentUser: auth.currentUser,
  collections: search.collections
});
const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  SearchActions: bindActionCreators(searchActions, dispatch)
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CollectionsContainer)
);

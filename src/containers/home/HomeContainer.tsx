import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { Divider, Icon } from 'antd';
import { CollectionCard } from 'components/collection';
import { LoadingIndicator, Notifications, Title } from 'components/common';
import { GridCardList } from 'components/list';
import { ICollectionSummary } from 'payloads';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { AuthState } from 'store/modules/auth';
import { actions as homeActions, HomeState } from 'store/modules/home';

interface Props extends RouteComponentProps {
  currentUser: AuthState['currentUser'];
  home: HomeState;
  HomeActions: typeof homeActions;
}

class HomeContainer extends React.Component<Props, {}> {
  public async componentDidMount() {
    const { HomeActions, history } = this.props;
    try {
      HomeActions.loadRecentlyUpdatedCollections();
      HomeActions.loadRecentlyCreatedCollections();
    } catch (error) {
      history.replace('/error');
    }
  }
  public componentWillUnmount() {
    const { HomeActions } = this.props;
    HomeActions.initialize();
  }

  private handleCreateBookmark = async (collectionId: number) => {
    const { HomeActions } = this.props;
    try {
      await HomeActions.createBookmark(collectionId);
    } catch (error) {
      throw error;
    }
  };
  private handleRemoveBookmark = async (collectionId: number) => {
    const { HomeActions } = this.props;
    try {
      await HomeActions.removeBookmark(collectionId);
    } catch (error) {
      throw error;
    }
  };

  public render(): React.ReactNode {
    const {
      currentUser,
      home: { recentlyCreatedCollections, recentlyUpdatedCollections },
    } = this.props;

    if (!recentlyCreatedCollections || !recentlyUpdatedCollections) {
      return <LoadingIndicator />;
    }
    return (
      <>
        <div>
          <Title text="새 아이템이 추가된 컬렉션" prefix={<Icon type="thunderbolt" />} />
          <GridCardList<ICollectionSummary>
            dataSource={recentlyUpdatedCollections}
            renderCard={(collection: ICollectionSummary) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                disableBookmark={currentUser ? false : true}
                onCreateBookmark={this.handleCreateBookmark}
                onRemoveBookmark={this.handleRemoveBookmark}
              />
            )}
          />
        </div>
        <Divider />
        <div>
          <>
            <Title text="최근 생성된 컬렉션" prefix={<Icon type="clock-circle" />} />
            <GridCardList<ICollectionSummary>
              dataSource={recentlyCreatedCollections}
              renderCard={(collection: ICollectionSummary) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  disableBookmark={currentUser ? false : true}
                  onCreateBookmark={this.handleCreateBookmark}
                  onRemoveBookmark={this.handleRemoveBookmark}
                />
              )}
            />
          </>
        </div>
        <div style={{ marginTop: 24 }}>
          <Notifications />
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ auth, home }: RootState) => ({
  currentUser: auth.currentUser,
  home,
});
const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  HomeActions: bindActionCreators(homeActions, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeContainer));

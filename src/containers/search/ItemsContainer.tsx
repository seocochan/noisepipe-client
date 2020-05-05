import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { message } from 'antd';
import { LoadingIndicator } from 'components/common';
import { ItemCard } from 'components/item';
import { GridCardList, ListHeader, LoadMoreButton } from 'components/list';
import { IItemSummary } from 'payloads';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { actions as searchActions, SearchState } from 'store/modules/search';
import { DEFAULT_ERROR_MESSAGE, DEFAULT_PAGE_SIZE } from 'values';

interface Props extends RouteComponentProps {
  currentTab: string;
  tabName: string;
  q: string;
  items: SearchState['items'];
  SearchActions: typeof searchActions;
}

class ItemsContainer extends React.Component<Props, {}> {
  public async componentDidMount() {
    const { q, SearchActions, history } = this.props;
    try {
      await SearchActions.loadItems(q);
    } catch (error) {
      message.error(DEFAULT_ERROR_MESSAGE);
      history.replace('/404');
    }
  }
  public componentDidUpdate(prevProps: Props) {
    const { currentTab, tabName, q, SearchActions } = this.props;
    if (currentTab !== prevProps.currentTab) {
      if (currentTab === tabName) {
        SearchActions.loadItems(q);
      } else if (prevProps.currentTab === tabName) {
        SearchActions.initialize();
      }
    } else if (currentTab === tabName && q !== prevProps.q) {
      SearchActions.loadItems(q);
    }
  }
  public componentWillUnmount() {
    const { SearchActions } = this.props;
    SearchActions.initialize();
  }

  private loadMore = async () => {
    const { SearchActions, items, q } = this.props;

    await SearchActions.loadItems(q, items!.page + 1, DEFAULT_PAGE_SIZE, true);
  };

  public render(): React.ReactNode {
    const { items, q } = this.props;

    if (!items) {
      return <LoadingIndicator />;
    }
    return (
      <>
        <ListHeader q={q} count={items.totalElements} name={'아이템'} />
        <GridCardList<IItemSummary>
          dataSource={items.content}
          renderCard={(item: IItemSummary) => <ItemCard key={item.id} item={item} />}
          isLast={items.last}
          loadMoreButton={<LoadMoreButton loadMore={this.loadMore} />}
        />
      </>
    );
  }
}

const mapStateToProps = ({ search }: RootState) => ({
  items: search.items,
});
const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  SearchActions: bindActionCreators(searchActions, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ItemsContainer));

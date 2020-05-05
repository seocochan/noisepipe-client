import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { message } from 'antd';
import { LoadingIndicator } from 'components/common';
import { GridCardList, ListHeader, LoadMoreButton } from 'components/list';
import { UserCard } from 'components/user';
import { IUserProfile } from 'payloads';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { actions as searchActions, SearchState } from 'store/modules/search';
import { DEFAULT_ERROR_MESSAGE, DEFAULT_PAGE_SIZE } from 'values';

interface Props extends RouteComponentProps {
  currentTab: string;
  tabName: string;
  q: string;
  users: SearchState['users'];
  SearchActions: typeof searchActions;
}

class UsersContainer extends React.Component<Props, {}> {
  public async componentDidMount() {
    const { q, SearchActions, history } = this.props;
    try {
      await SearchActions.loadUsers(q);
    } catch (error) {
      message.error(DEFAULT_ERROR_MESSAGE);
      history.replace('/404');
    }
  }
  public componentDidUpdate(prevProps: Props) {
    const { currentTab, tabName, q, SearchActions } = this.props;
    if (currentTab !== prevProps.currentTab) {
      if (currentTab === tabName) {
        SearchActions.loadUsers(q);
      } else if (prevProps.currentTab === tabName) {
        SearchActions.initialize();
      }
    } else if (currentTab === tabName && q !== prevProps.q) {
      SearchActions.loadUsers(q);
    }
  }
  public componentWillUnmount() {
    const { SearchActions } = this.props;
    SearchActions.initialize();
  }

  private loadMore = async () => {
    const { SearchActions, users, q } = this.props;

    await SearchActions.loadUsers(q, users!.page + 1, DEFAULT_PAGE_SIZE, true);
  };

  public render(): React.ReactNode {
    const { users, q } = this.props;

    if (!users) {
      return <LoadingIndicator />;
    }
    return (
      <>
        <ListHeader q={q} count={users.totalElements} unit={'명'} name={'사용자'} />
        <GridCardList<IUserProfile>
          dataSource={users.content}
          renderCard={(user: IUserProfile) => <UserCard key={user.id} user={user} />}
          isLast={users.last}
          loadMoreButton={<LoadMoreButton loadMore={this.loadMore} />}
        />
      </>
    );
  }
}

const mapStateToProps = ({ search }: RootState) => ({
  users: search.users,
});
const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  SearchActions: bindActionCreators(searchActions, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UsersContainer));

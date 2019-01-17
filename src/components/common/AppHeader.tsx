import * as React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

import { Icon, Input, Layout, Menu, message } from 'antd';
import { ClickParam } from 'antd/lib/menu';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { actions as authActions, AuthState } from 'store/modules/auth';
import { ACCESS_TOKEN } from 'values';

import styles from './AppHeader.module.less';

interface Props extends RouteComponentProps<{ username: string }> {
  auth: AuthState;
  AuthActions: typeof authActions;
}

class AppHeader extends React.Component<Props, {}> {
  private handleLogout = () => {
    const { AuthActions, history } = this.props;

    localStorage.removeItem(ACCESS_TOKEN);
    AuthActions.logout();

    history.push('/');
    message.success('로그아웃 되었습니다');
  };

  private handleClick = (e: ClickParam) => {
    if (e.key === 'logout') {
      this.handleLogout();
    }
  };

  private mapPathnameToKey = (pathname: string) => {
    const { currentUser } = this.props.auth;
    if (!currentUser) {
      return pathname;
    }
    const { username } = currentUser;

    // FIXME: use regex
    if (
      pathname === `/@${username}/collections` ||
      pathname === `/@${username}/bookmarks` ||
      pathname === `/@${username}/comments`
    ) {
      return '/me/*';
    }
    return pathname;
  };

  public render(): React.ReactNode {
    const { currentUser } = this.props.auth;

    let menuItems;
    if (currentUser) {
      menuItems = [
        <Menu.Item key="/">
          <Link to="/">
            <Icon type="home" />홈
          </Link>
        </Menu.Item>,
        <Menu.Item key="/me/*">
          <Link to={`/@${currentUser.username}/collections`}>
            <Icon type="database" />
            컬렉션
          </Link>
        </Menu.Item>,
        <Menu.SubMenu
          key="/me"
          title={
            <span>
              <Icon type="user" />
              {currentUser.username}
            </span>
          }
        >
          <Menu.Item key="/settings">
            <Link to="/settings">설정</Link>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="logout">로그아웃</Menu.Item>
        </Menu.SubMenu>
      ];
    } else {
      menuItems = [
        <Menu.Item key="/login">
          <Link to="/login">로그인</Link>
        </Menu.Item>,
        <Menu.Item key="/signup">
          <Link to="/signup">회원가입</Link>
        </Menu.Item>
      ];
    }

    return (
      <Layout.Header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.title}>
            <Link to="/">NOISEPIPE</Link>
          </div>
          <Input.Search
            className={styles.search}
            placeholder="검색"
            style={{ margin: '10px 12px' }}
          />
          <Menu
            mode="horizontal"
            selectedKeys={[this.mapPathnameToKey(this.props.location.pathname)]}
            style={{ lineHeight: '56px', marginLeft: 'auto' }}
            onClick={this.handleClick}
          >
            {menuItems}
          </Menu>
        </div>
      </Layout.Header>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  auth: state.auth
});

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  AuthActions: bindActionCreators(authActions, dispatch)
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AppHeader)
);

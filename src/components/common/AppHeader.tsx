import * as React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

import { Icon, Layout, Menu, message } from 'antd';
import { ClickParam } from 'antd/lib/menu';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { actions as authActions, AuthState } from 'store/modules/auth';
import { ACCESS_TOKEN } from 'values';

import styles from './AppHeader.module.less';
import SearchInput from './SearchInput';

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
    message.info('로그아웃 했습니다');
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
    const regex = new RegExp(`/@${currentUser.username}/(collections|bookmarks|comments)`);
    return regex.test(pathname) ? '/me/*' : pathname;
  };

  public render(): React.ReactNode {
    const { currentUser } = this.props.auth;

    let menuItems;
    if (currentUser) {
      menuItems = [
        <Menu.Item key="/">
          <Link to="/">
            <Icon type="home" />
            <span className={styles.menuText}>홈</span>
          </Link>
        </Menu.Item>,
        <Menu.Item className={styles.searchMenu} key="/search">
          <Link to="/search">
            <Icon type="search" />
            <span className={styles.menuText}>검색</span>
          </Link>
        </Menu.Item>,
        <Menu.Item key="/me/*">
          <Link to={`/@${currentUser.username}/collections`}>
            <Icon type="database" />
            <span className={styles.menuText}>컬렉션</span>
          </Link>
        </Menu.Item>,
        <Menu.SubMenu
          key="/me"
          title={
            <span>
              <Icon type="user" />
              <span className={styles.menuText}>{currentUser.username}</span>
            </span>
          }
        >
          <Menu.Item key="/setting">
            <Link to="/setting">설정</Link>
          </Menu.Item>
          <Menu.Item key="logout">로그아웃</Menu.Item>
        </Menu.SubMenu>,
      ];
    } else {
      menuItems = [
        <Menu.Item key="/">
          <Link to="/">
            <Icon type="home" />
            <span className={styles.menuText}>홈</span>
          </Link>
        </Menu.Item>,
        <Menu.Item className={styles.searchMenu} key="/search">
          <Link to="/search">
            <Icon type="search" />
            <span className={styles.menuText}>검색</span>
          </Link>
        </Menu.Item>,
        <Menu.Item key="/login">
          <Link to="/login">로그인</Link>
        </Menu.Item>,
        <Menu.Item key="/signup">
          <Link to="/signup">회원가입</Link>
        </Menu.Item>,
      ];
    }

    return (
      <Layout.Header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.title}>
            <Link to="/">NOISEPIPE</Link>
          </div>
          <SearchInput className={styles.searchInput} />
          <Menu
            className={styles.menu}
            mode="horizontal"
            selectedKeys={[this.mapPathnameToKey(this.props.location.pathname)]}
            style={{ lineHeight: '56px' }}
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
  auth: state.auth,
});

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  AuthActions: bindActionCreators(authActions, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppHeader));

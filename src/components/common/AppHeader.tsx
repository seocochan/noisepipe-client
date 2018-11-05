import * as React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

import { Icon, Layout, Menu } from 'antd';
import { RootState } from 'store';
import { AuthState } from 'store/modules/auth';

import './AppHeader.less';

interface Props extends RouteComponentProps {
  auth: AuthState;
  onLogout(): void;
}

class AppHeader extends React.Component<Props, {}> {
  public render(): React.ReactNode {
    const { currentUser } = this.props.auth;

    let menuItems;
    if (currentUser) {
      menuItems = [
        <Menu.Item key="/">
          <Link to="/">
            <Icon type="home" className="nav-icon" />
          </Link>
        </Menu.Item>
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
      <Layout.Header className="app-header">
        <div className="container">
          <div className="app-title">
            <Link to="/">Noisepipe</Link>
          </div>
          <Menu
            className="app-menu"
            mode="horizontal"
            selectedKeys={[this.props.location.pathname]}
            theme={'dark'}
            style={{ lineHeight: '64px' }}
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

export default withRouter(connect(mapStateToProps)(AppHeader));

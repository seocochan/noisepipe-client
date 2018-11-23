import * as React from 'react';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

import { Layout, notification } from 'antd';
import { AppHeader, LoadingIndicator } from 'components/common';
import { Login, Signup } from 'components/user';
import { NotFound } from 'pages';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { actions as authActions, AuthState } from 'store/modules/auth';
import { ACCESS_TOKEN } from 'values';

import styles from './App.module.less';

interface Props extends RouteComponentProps {
  auth: AuthState;
  AuthActions: typeof authActions;
}

class App extends React.Component<Props, {}> {
  public componentDidMount(): void {
    notification.config({
      placement: 'topRight',
      top: 70,
      duration: 3
    });

    const { AuthActions } = this.props;
    AuthActions.getCurrnetUser();
  }

  private handleLogin = () => {
    const { AuthActions, history } = this.props;

    notification.success({
      message: 'Noisepipe',
      description: '로그인에 성공했습니다'
    });

    AuthActions.getCurrnetUser();
    history.push('/');
  };

  private handleLogout = () => {
    const { AuthActions, history } = this.props;

    localStorage.removeItem(ACCESS_TOKEN);
    AuthActions.logout();

    history.push('/');
    notification.success({
      message: 'Noisepipe',
      description: '로그아웃 되었습니다'
    });
  };

  public render(): React.ReactNode {
    const { isLoading } = this.props.auth;

    if (isLoading) {
      return <LoadingIndicator />;
    }
    return (
      <Layout>
        <AppHeader onLogout={this.handleLogout} />
        <Layout.Content className={styles.content}>
          <div className={styles.container}>
            <button onClick={this.handleLogout}>로그아웃</button>
            {process.env.REACT_APP_FOO}
            <Switch>
              <Route exact={true} path="/" />
              <Route
                path="/login"
                render={props => (
                  <Login onLogin={this.handleLogin} {...props} />
                )}
              />
              <Route path="/signup" component={Signup} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </Layout.Content>
      </Layout>
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
  )(App)
);

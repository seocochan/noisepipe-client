import * as React from 'react';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

import { Layout, notification } from 'antd';
import { AppHeader, LoadingIndicator } from 'components/common';
import { Login, Signup } from 'components/user';
import { NotFound } from 'pages';
import { ICurrentUserResponse } from 'payloads';
import { getCurrentUser } from 'utils/API';
import { ACCESS_TOKEN } from 'values';

import './App.less';

export interface IAppState {
  currentUser?: ICurrentUserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

class App extends React.Component<{} & RouteComponentProps, IAppState> {
  public readonly state: IAppState = {
    currentUser: null,
    isAuthenticated: false,
    isLoading: false
  };

  public componentDidMount(): void {
    notification.config({
      placement: 'topRight',
      top: 70,
      duration: 3
    });

    this.loadCurrentUser();
  }

  private handleLogin = () => {
    notification.success({
      message: 'Noisepipe',
      description: '로그인에 성공했습니다'
    });
    this.loadCurrentUser();
    this.props.history.push('/');
  };

  private loadCurrentUser = async () => {
    this.setState({ isLoading: true });

    try {
      const res = await getCurrentUser();
      this.setState({
        currentUser: res.data,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  };

  private handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    this.setState({
      currentUser: null,
      isAuthenticated: false
    });

    this.props.history.push('/');
    notification.success({
      message: 'Noisepipe',
      description: '로그아웃 되었습니다'
    });
  };

  public render(): React.ReactNode {
    const { isLoading, currentUser } = this.state;

    if (isLoading) {
      return <LoadingIndicator />;
    }
    return (
      <Layout className="app-container">
        <AppHeader currentUser={currentUser} onLogout={this.handleLogout} />
        <Layout.Content className="app-content">
          <div className="container">
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

export default withRouter(App);

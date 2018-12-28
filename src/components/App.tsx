import * as React from 'react';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

import { Layout, message } from 'antd';
import { AppHeader, LoadingIndicator, PrivateRoute } from 'components/common';
import { Login, Signup } from 'components/user';
import { ItemPanelContainer } from 'containers/item';
import { Collection, CollectionIndex, Home, NotFound, ServerError } from 'pages';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { actions as authActions, AuthState } from 'store/modules/auth';

import styles from './App.module.less';

interface Props extends RouteComponentProps {
  auth: AuthState;
  AuthActions: typeof authActions;
}

class App extends React.Component<Props, {}> {
  public async componentDidMount() {
    message.config({ top: 64 });

    const { AuthActions } = this.props;
    try {
      await AuthActions.getCurrnetUser();
    } catch (error) {
      console.log(error);
    }
  }

  public render(): React.ReactNode {
    const { isLoading } = this.props.auth;

    if (isLoading) {
      return <LoadingIndicator />;
    }
    return (
      <Layout>
        <AppHeader />
        <Layout>
          <Layout.Content className={styles.content}>
            <div className={styles.container}>
              <Switch>
                <Route exact={true} path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/signup" component={Signup} />
                <Route
                  path="/collections/:collectionId"
                  component={Collection}
                />
                <PrivateRoute
                  path="/me/(collections|bookmarks|comments)"
                  component={CollectionIndex}
                />
                <Route exact={true} path="/error" component={ServerError} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </Layout.Content>
          <ItemPanelContainer />
        </Layout>
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

import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { Form, message } from 'antd';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { actions as authActions, AuthState } from 'store/modules/auth';

import styles from './Login.module.less';
import LoginForm from './LoginForm';

export interface Props extends RouteComponentProps {
  auth: AuthState;
  AuthActions: typeof authActions;
}

class Login extends React.Component<Props, {}> {
  public componentDidMount() {
    const { auth, history, location } = this.props;

    if (auth.currentUser) {
      history.replace('/');
    }
    if (location.state && location.state.from) {
      // PrivateRoute에 의해 redirect된 경우
      message.warn('로그인이 필요한 서비스입니다');
    }
  }

  private handleLogin = () => {
    const { AuthActions, history, location } = this.props;

    AuthActions.getCurrnetUser();

    if (location.state && location.state.from) {
      // PrivateRoute에 의해 redirect된 경우
      history.replace(location.state.from);
    } else {
      history.replace('/');
    }
  };

  public render() {
    const AntWrappedLoginForm = Form.create()(LoginForm);

    return (
      <div className={styles.container}>
        <h1>로그인</h1>
        <div>
          <AntWrappedLoginForm onLogin={this.handleLogin} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  AuthActions: bindActionCreators(authActions, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));

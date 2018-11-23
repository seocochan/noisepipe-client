import * as React from 'react';

import { Form } from 'antd';

import styles from './Login.module.less';
import LoginForm from './LoginForm';

export interface ILoginProps {
  onLogin(): void;
}

const Login: React.SFC<ILoginProps> = props => {
  const AntWrappedLoginForm = Form.create()(LoginForm);
  return (
    <div className={styles.container}>
      <h1>로그인</h1>
      <div>
        <AntWrappedLoginForm onLogin={props.onLogin} />
      </div>
    </div>
  );
};

export default Login;

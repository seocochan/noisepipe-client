import * as React from 'react';
import { Link } from 'react-router-dom';

import { Button, Form, Icon, Input, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { login } from 'utils/api/auth';
import { ACCESS_TOKEN, DEFAULT_ERROR_MESSAGE } from 'values';

import styles from './LoginForm.module.less';

interface Props extends FormComponentProps {
  onLogin(): void;
}

const LoginForm: React.SFC<Props> = props => {
  const handleSubmit = (event: React.FormEvent<any>) => {
    event.preventDefault();
    props.form.validateFields(async (error: any, values: any) => {
      if (!error) {
        try {
          const res = await login({ ...values });
          localStorage.setItem(ACCESS_TOKEN, res.data.accessToken);
          props.onLogin();
        } catch (error) {
          if (error.response.status === 401) {
            message.error('아이디와 비밀번호를 확인해주세요');
          } else {
            message.error(DEFAULT_ERROR_MESSAGE);
          }
        }
      }
    });
  };

  const { getFieldDecorator } = props.form;
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item>
        {getFieldDecorator('username', {
          rules: [{ required: true, message: '아이디를 입력해주세요' }]
        })(
          <Input
            prefix={<Icon type="user" />}
            size="large"
            name="username"
            placeholder="아이디"
          />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: '비밀번호를 입력해주세요' }]
        })(
          <Input
            prefix={<Icon type="lock" />}
            size="large"
            name="password"
            type="password"
            placeholder="비밀번호"
          />
        )}
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          className={styles.loginButton}
        >
          로그인
        </Button>
        처음이신가요? <Link to="/signup">회원가입</Link>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;

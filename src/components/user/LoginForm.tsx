import * as React from 'react';
import { Link } from 'react-router-dom';

import { Button, Form, Icon, Input, notification } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { login } from 'utils/API';
import { ACCESS_TOKEN } from 'values';

import styles from './LoginForm.module.less';

export interface ILoginFormProps {
  onLogin(): void;
}

const LoginForm: React.SFC<ILoginFormProps & FormComponentProps> = props => {
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
            notification.error({
              message: 'Noisepipe',
              description: '아이디와 비밀번호를 확인해주세요'
            });
          } else {
            notification.error({
              message: 'Noisepipe',
              description: '에러가 발생했습니다'
            });
          }
        }
      }
    });
  };

  const { getFieldDecorator } = props.form;
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item>
        {getFieldDecorator('usernameOrEmail', {
          rules: [
            { required: true, message: '아이디나 이메일 주소를 입력해주세요' }
          ]
        })(
          <Input
            prefix={<Icon type="user" />}
            size="large"
            name="usernameOrEmail"
            placeholder="아이디 혹은 이메일 주소"
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

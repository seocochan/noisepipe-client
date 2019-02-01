import * as React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';

import { Button, Form, Input, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction } from 'store';
import { actions as authActions } from 'store/modules/auth';
import { checkUsernameAvailability } from 'utils/api/user';
import {
  DEFAULT_ERROR_MESSAGE,
  MAX_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH
} from 'values';

import styles from './Signup.module.less';

type FormData = {
  username: string;
  password: string;
  confirm: string;
};

interface Props extends RouteComponentProps, FormComponentProps {
  AuthActions: typeof authActions;
}

class Signup extends React.Component<Props, {}> {
  private handleSubmit = async (e: React.FormEvent<any>) => {
    e.preventDefault();
    const {
      AuthActions,
      history,
      form: { validateFields }
    } = this.props;
    validateFields(async (err, { username, password }: FormData) => {
      if (err) {
        return;
      }
      try {
        await AuthActions.signup({ username, password });
        history.push('/login');
        message.success('가입에 성공했습니다');
      } catch (error) {
        history.push('/');
        message.error(DEFAULT_ERROR_MESSAGE);
      }
    });
  };
  // FIXME: debounce
  private validateUsernameAvailability = async (
    _: any,
    value: string,
    callback: any
  ) => {
    let available: boolean;
    try {
      available = false;
      const res = await checkUsernameAvailability(value);
      available = res.data.available;
    } catch (error) {
      // 에러 발생시 일단 success 처리하고, submit시 다시 확인하도록
      available = true;
    }
    return available ? callback() : callback('이미 사용 중입니다');
  };
  private confirmPassword = (rule: any, value: string, callback: any) => {
    const { getFieldValue } = this.props.form;
    return getFieldValue('password') === value
      ? callback()
      : callback('비밀번호를 확인해주세요');
  };
  private checkSubmitButtonAvailable = () => {
    const { getFieldsError, getFieldValue } = this.props.form;
    const errors: {
      username?: string;
      password?: string;
      confirm?: string;
    } = getFieldsError();

    if (
      !getFieldValue('username') ||
      !getFieldValue('password') ||
      !getFieldValue('confirm')
    ) {
      return false;
    }
    if (errors.username || errors.password || errors.confirm) {
      return false;
    }
    return true;
  };

  public render(): React.ReactNode {
    const {
      form: { getFieldDecorator }
    } = this.props;

    return (
      <div className={styles.container}>
        <h1>회원가입</h1>
        <div>
          <Form onSubmit={this.handleSubmit} className={styles.signupForm}>
            <Form.Item label="아이디" hasFeedback={true}>
              {getFieldDecorator('username', {
                validateFirst: true,
                rules: [
                  {
                    message: `${MIN_USERNAME_LENGTH}자에서 ${MAX_USERNAME_LENGTH}자 사이로 입력`,
                    min: MIN_USERNAME_LENGTH,
                    max: MAX_USERNAME_LENGTH
                  },
                  {
                    message: `영문, 숫자, '_' 입력`,
                    required: true,
                    whitespace: true,
                    pattern: /^\w+$/
                  },
                  { validator: this.validateUsernameAvailability }
                ]
              })(
                <Input
                  size="large"
                  name="username"
                  autoComplete="off"
                  placeholder="아이디"
                />
              )}
            </Form.Item>
            <Form.Item label="비밀번호">
              {getFieldDecorator('password', {
                rules: [
                  {
                    message: '비밀번호 입력',
                    required: true,
                    whitespace: true
                  },
                  {
                    message: `${MIN_PASSWORD_LENGTH}자 이상 입력`,
                    min: MIN_PASSWORD_LENGTH
                  },
                  {
                    message: `${MAX_PASSWORD_LENGTH}자 이하 입력`,
                    max: MAX_PASSWORD_LENGTH
                  }
                ]
              })(
                <Input
                  size="large"
                  name="password"
                  type="password"
                  autoComplete="off"
                  placeholder="비밀번호"
                />
              )}
            </Form.Item>
            <Form.Item label="비밀번호 확인">
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    message: '비밀번호를 다시 입력하세요',
                    required: true,
                    whitespace: true
                  },
                  { validator: this.confirmPassword }
                ]
              })(
                <Input
                  size="large"
                  name="confirm"
                  type="password"
                  autoComplete="off"
                  placeholder="비밀번호 확인"
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button
                className={styles.signupButton}
                type="primary"
                htmlType="submit"
                size="large"
                disabled={!this.checkSubmitButtonAvailable()}
              >
                회원가입
              </Button>
              이미 가입하셨나요? <Link to="/login">로그인</Link>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  AuthActions: bindActionCreators(authActions, dispatch)
});

export default connect(
  null,
  mapDispatchToProps
)(Form.create()(Signup));

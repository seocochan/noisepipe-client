import * as React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';

import { Button, Form, Input, message } from 'antd';
import { FormItemProps } from 'antd/lib/form';
import { ISignupReqeust } from 'payloads';
import { RootState } from 'store';
import { AuthState } from 'store/modules/auth';
import { checkUsernameAvailability, signup } from 'utils/api/auth';
import {
  DEFAULT_ERROR_MESSAGE,
  MAX_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH
} from 'values';

import styles from './Signup.module.less';

interface IFormData {
  value: string;
  errorMsg?: string | undefined | null;
  validateStatus?: FormItemProps['validateStatus'];
}

interface Props extends RouteComponentProps {
  auth: AuthState;
}

interface State {
  username: IFormData;
  password: IFormData;
}

class Signup extends React.Component<Props, State> {
  public readonly state: State = {
    username: { value: '' },
    password: { value: '' }
  };

  public componentDidMount() {
    const { auth, history } = this.props;

    if (auth.currentUser) {
      history.replace('/');
    }
  }

  private handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    validateFun: any
  ) => {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    this.setState({
      [inputName]: { value: inputValue, ...validateFun(inputValue) }
    } as Pick<State, keyof State>);
  };

  private handleSubmit = async (event: React.FormEvent<any>): Promise<void> => {
    event.preventDefault();
    const { username, password } = this.state;

    const signupRequest: ISignupReqeust = {
      username: username.value,
      password: password.value
    };

    try {
      await signup(signupRequest);
      message.success('가입에 성공했습니다. 로그인 해주세요');
      this.props.history.push('/login');
    } catch (error) {
      message.error(DEFAULT_ERROR_MESSAGE);
    }
  };

  private isFormInvalid = (): boolean => {
    const { username, password } = this.state;
    return !(
      username.validateStatus === 'success' &&
      password.validateStatus === 'success'
    );
  };

  public render(): React.ReactNode {
    const { username, password } = this.state;
    return (
      <div className={styles.container}>
        <h1>회원가입</h1>
        <div>
          <Form onSubmit={this.handleSubmit} className={styles.signupForm}>
            <Form.Item
              label="아이디"
              hasFeedback={true}
              validateStatus={username.validateStatus}
              help={username.errorMsg}
            >
              <Input
                size="large"
                name="username"
                autoComplete="off"
                placeholder="아이디"
                value={username.value}
                onBlur={this.validateUsernameAvailability}
                onChange={event =>
                  this.handleInputChange(event, this.validateUsername)
                }
              />
            </Form.Item>
            <Form.Item
              label="비밀번호"
              validateStatus={password.validateStatus}
              help={password.errorMsg}
            >
              <Input
                size="large"
                name="password"
                type="password"
                autoComplete="off"
                placeholder={`${MIN_PASSWORD_LENGTH}자 이상`}
                value={password.value}
                onChange={event =>
                  this.handleInputChange(event, this.validatePassword)
                }
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className={styles.signupButton}
                disabled={this.isFormInvalid()}
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

  private validateUsername = (username: string): Partial<IFormData> => {
    if (username.length < MIN_USERNAME_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `아이디가 너무 짧습니다. (${MIN_USERNAME_LENGTH}자 이상)`
      };
    } else if (username.length > MAX_USERNAME_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `아이디가 너무 깁니다. (${MAX_USERNAME_LENGTH}자 이하)`
      };
    } else {
      return {
        validateStatus: undefined,
        errorMsg: null
      };
    }
  };

  private validatePassword = (password: string): Partial<IFormData> => {
    if (password.length < MIN_PASSWORD_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `비밀번호가 너무 짧습니다. (${MIN_PASSWORD_LENGTH}자 이상)`
      };
    } else if (password.length > MAX_PASSWORD_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `비밀번호가 너무 깁니다. (${MAX_PASSWORD_LENGTH}자 이하)`
      };
    } else {
      return {
        validateStatus: 'success',
        errorMsg: null
      };
    }
  };

  private validateUsernameAvailability = async () => {
    const usernameValue = this.state.username.value;
    const usernameValidation = this.validateUsername(usernameValue);

    // 이미 form의 validation을 통과하지 못한 경우
    if (usernameValidation.validateStatus === 'error') {
      this.setState({
        username: {
          value: usernameValue,
          ...usernameValidation
        }
      });
      return;
    }

    // form의 validation은 통과, 중복 확인 validation을 시작
    this.setState({
      username: {
        value: usernameValue,
        validateStatus: 'validating',
        errorMsg: null
      }
    });

    try {
      const res = await checkUsernameAvailability(usernameValue);
      if (res.data.available) {
        this.setState({
          username: {
            value: usernameValue,
            validateStatus: 'success',
            errorMsg: null
          }
        });
      } else {
        this.setState({
          username: {
            value: usernameValue,
            validateStatus: 'error',
            errorMsg: '이미 등록된 아이디입니다'
          }
        });
      }
    } catch (error) {
      // 알 수 없는 서버 에러. 일단 success 처리하고, submit시 다시 확인하도록
      this.setState({
        username: {
          value: usernameValue,
          validateStatus: 'success',
          errorMsg: null
        }
      });
    }
  };
}

const mapStateToProps = ({ auth }: RootState) => ({
  auth
});

export default connect(mapStateToProps)(Signup);

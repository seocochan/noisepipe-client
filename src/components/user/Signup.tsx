import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import { Button, Form, Input, notification } from 'antd';
import { FormItemProps } from 'antd/lib/form';
import { ISignupReqeust } from 'payloads';
import { checkEmailAvailability, checkUsernameAvailability, signup } from 'utils/API';
import {
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH
} from 'values';

import styles from './Signup.module.less';

interface IFormData {
  value: string;
  errorMsg?: string | undefined | null;
  validateStatus?: FormItemProps['validateStatus'];
}

export interface ISignupState {
  name: IFormData;
  username: IFormData;
  email: IFormData;
  password: IFormData;
}

class Signup extends React.Component<{} & RouteComponentProps, ISignupState> {
  public readonly state: ISignupState = {
    name: { value: '' },
    username: { value: '' },
    email: { value: '' },
    password: { value: '' }
  };

  private handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    validateFun: any
  ) => {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    this.setState({
      [inputName]: { value: inputValue, ...validateFun(inputValue) }
    } as Pick<ISignupState, keyof ISignupState>);
  };

  private handleSubmit = async (event: React.FormEvent<any>): Promise<void> => {
    event.preventDefault();
    const { name, email, username, password } = this.state;

    const signupRequest: ISignupReqeust = {
      name: name.value,
      email: email.value,
      username: username.value,
      password: password.value
    };

    try {
      await signup(signupRequest);
      notification.success({
        message: 'Noisepipe',
        description: '가입에 성공했습니다. 로그인 해주세요'
      });
      this.props.history.push('/login');
    } catch (error) {
      notification.error({
        message: 'Noisepipe',
        description: '오류가 발생했습니다'
      });
    }
  };

  private isFormInvalid = (): boolean => {
    const { name, email, username, password } = this.state;
    return !(
      name.validateStatus === 'success' &&
      username.validateStatus === 'success' &&
      email.validateStatus === 'success' &&
      password.validateStatus === 'success'
    );
  };

  public render(): React.ReactNode {
    const { name, email, username, password } = this.state;
    return (
      <div className={styles.container}>
        <h1>회원가입</h1>
        <div>
          <Form onSubmit={this.handleSubmit} className={styles.signupForm}>
            <Form.Item
              label="이름"
              validateStatus={name.validateStatus}
              help={name.errorMsg}
            >
              <Input
                size="large"
                name="name"
                autoComplete="off"
                placeholder="이름"
                value={name.value}
                onChange={event =>
                  this.handleInputChange(event, this.validateName)
                }
              />
            </Form.Item>
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
              label="이메일"
              hasFeedback={true}
              validateStatus={email.validateStatus}
              help={email.errorMsg}
            >
              <Input
                size="large"
                name="email"
                type="email"
                autoComplete="off"
                placeholder="이메일 주소"
                value={email.value}
                onBlur={this.validateEmailAvailability}
                onChange={event =>
                  this.handleInputChange(event, this.validateEmail)
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
                placeholder="6자 이상, 20자 이하"
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

  private validateName = (name: string): Partial<IFormData> => {
    if (name.length < NAME_MIN_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `이름이 너무 짧습니다. (${NAME_MIN_LENGTH}자 이상)`
      };
    } else if (name.length > NAME_MAX_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `이름이 너무 깁니다. (${NAME_MAX_LENGTH}자 이하)`
      };
    } else {
      return {
        validateStatus: 'success',
        errorMsg: null
      };
    }
  };

  private validateEmail = (email: string): Partial<IFormData> => {
    if (!email) {
      return {
        validateStatus: 'error',
        errorMsg: '이메일 주소를 입력해주세요'
      };
    }

    const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
    if (!EMAIL_REGEX.test(email)) {
      return {
        validateStatus: 'error',
        errorMsg: '잘못된 이메일 주소입니다'
      };
    }

    if (email.length > EMAIL_MAX_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `이메일 주소가 너무 깁니다. (${EMAIL_MAX_LENGTH}자 이하)`
      };
    }

    return {
      validateStatus: undefined,
      errorMsg: null
    };
  };

  private validateUsername = (username: string): Partial<IFormData> => {
    if (username.length < USERNAME_MIN_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `아이디가 너무 짧습니다. (${USERNAME_MIN_LENGTH}자 이상)`
      };
    } else if (username.length > USERNAME_MAX_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `아이디가 너무 깁니다. (${USERNAME_MAX_LENGTH}자 이하)`
      };
    } else {
      return {
        validateStatus: undefined,
        errorMsg: null
      };
    }
  };

  private validatePassword = (password: string): Partial<IFormData> => {
    if (password.length < PASSWORD_MIN_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `비밀번호가 너무 짧습니다. (${PASSWORD_MIN_LENGTH}자 이상)`
      };
    } else if (password.length > PASSWORD_MAX_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `비밀번호가 너무 깁니다. (${PASSWORD_MAX_LENGTH}자 이하)`
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

  private validateEmailAvailability = async () => {
    const emailValue = this.state.email.value;
    const emailValidation = this.validateEmail(emailValue);

    if (emailValidation.validateStatus === 'error') {
      this.setState({
        email: {
          value: emailValue,
          ...emailValidation
        }
      });
      return;
    }

    this.setState({
      email: {
        value: emailValue,
        validateStatus: 'validating',
        errorMsg: null
      }
    });

    try {
      const res = await checkEmailAvailability(emailValue);
      if (res.data.available) {
        this.setState({
          email: {
            value: emailValue,
            validateStatus: 'success',
            errorMsg: null
          }
        });
      } else {
        this.setState({
          email: {
            value: emailValue,
            validateStatus: 'error',
            errorMsg: '이미 등록된 이메일입니다'
          }
        });
      }
    } catch (error) {
      this.setState({
        email: {
          value: emailValue,
          validateStatus: 'success',
          errorMsg: null
        }
      });
    }
  };
}

export default Signup;

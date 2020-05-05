import * as React from 'react';

import { Button, Form, Input, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { IPasswordUpdateRequest } from 'payloads';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from 'values';

interface Props extends FormComponentProps {
  onSubmit: (data: IPasswordUpdateRequest) => Promise<void>;
}

const UpdatePasswordForm: React.FC<Props> = ({
  onSubmit,
  form: { getFieldDecorator, getFieldValue, validateFields, resetFields },
}) => {
  const handleSubmit = async (e: React.FormEvent<any>) => {
    e.preventDefault();
    validateFields(['confirmNewPassword'], { force: true });
    validateFields(async (err, { oldPassword, newPassword }: IPasswordUpdateRequest) => {
      if (err) {
        return;
      }
      try {
        await onSubmit({ oldPassword, newPassword });
        message.success('비밀번호를 변경했습니다');
        resetFields();
      } catch (error) {
        message.error('비밀번호를 확인해주세요');
      }
    });
  };
  const confirmNewPassword = (rule: any, value: string, callback: any) => {
    return getFieldValue('newPassword') === value ? callback() : callback('비밀번호를 확인해주세요');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="기존 비밀번호">
        {getFieldDecorator('oldPassword', {
          rules: [
            {
              message: '기존 비밀번호 입력',
              required: true,
              whitespace: true,
            },
            {
              message: `${MIN_PASSWORD_LENGTH}자 이상 입력`,
              min: MIN_PASSWORD_LENGTH,
            },
            {
              message: `${MAX_PASSWORD_LENGTH}자 이하 입력`,
              max: MAX_PASSWORD_LENGTH,
            },
          ],
        })(<Input size="large" name="old-password" type="password" autoComplete="off" placeholder="기존 비밀번호" />)}
      </Form.Item>
      <Form.Item label="새 비밀번호">
        {getFieldDecorator('newPassword', {
          rules: [
            {
              message: '새 비밀번호 입력',
              required: true,
              whitespace: true,
            },
            {
              message: `${MIN_PASSWORD_LENGTH}자 이상 입력`,
              min: MIN_PASSWORD_LENGTH,
            },
            {
              message: `${MAX_PASSWORD_LENGTH}자 이하 입력`,
              max: MAX_PASSWORD_LENGTH,
            },
          ],
        })(<Input size="large" name="new-password" type="password" autoComplete="off" placeholder="새 비밀번호" />)}
      </Form.Item>
      <Form.Item label="새 비밀번호 확인">
        {getFieldDecorator('confirmNewPassword', {
          rules: [
            {
              required: true,
              whitespace: true,
            },
            { validator: confirmNewPassword },
          ],
        })(
          <Input
            size="large"
            name="confirm-new-password"
            type="password"
            autoComplete="off"
            placeholder="새 비밀번호 확인"
          />,
        )}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" size="large" style={{ width: '100%' }}>
          변경 완료
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create()(UpdatePasswordForm);

import * as React from 'react';

import { Button, Form, Input, message } from 'antd';
import { FormItemProps } from 'antd/lib/form';
import { ICommentRequest, ICommentResponse } from 'payloads';
import { DEFAULT_ERROR_MESSAGE, MAX_COMMENT_TEXT_LENGTH } from 'values';

interface Props {
  text?: string;
  replyTo?: ICommentResponse['id'];
  showCancel?: boolean;
  onSubmit: (data: ICommentRequest) => Promise<void>;
  onCancel?: () => void;
  onSuccess?: () => void;
  gutterBottom?: number;
  submitPlaceholder?: string;
}
interface State {
  value: string;
  validateStatus: FormItemProps['validateStatus'];
  errorMsg: string;
}

class CommentForm extends React.Component<Props, State> {
  public static defaultProps = {
    showCancel: false,
    gutterBottom: 0,
    submitPlaceholder: '작성'
  };
  public readonly state: State = {
    value: this.props.text || '',
    validateStatus: undefined,
    errorMsg: ''
  };

  private validate = (value: string) => {
    return value.length <= MAX_COMMENT_TEXT_LENGTH;
  };
  private handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.currentTarget;
    if (this.validate(value)) {
      this.setState({ value, validateStatus: undefined, errorMsg: '' });
    } else {
      this.setState({
        value,
        validateStatus: 'error',
        errorMsg: `${MAX_COMMENT_TEXT_LENGTH}자 이하로 작성해주세요`
      });
    }
  };
  private handleSubmit = async (e: React.FormEvent<any>) => {
    e.preventDefault();
    const { replyTo, onSubmit, onSuccess, submitPlaceholder } = this.props;
    const { value, validateStatus } = this.state;
    const text = value.trim();
    if (!text) {
      this.setState({
        validateStatus: 'error',
        errorMsg: '내용을 입력해주세요'
      });
      return;
    }
    if (validateStatus === 'error') {
      return;
    }

    try {
      this.setState({ validateStatus: 'validating' });
      await onSubmit({ text, replyTo });

      message.success(`댓글을 ${submitPlaceholder}했습니다`);
      this.setState({ value: '', validateStatus: undefined, errorMsg: '' });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      message.error(DEFAULT_ERROR_MESSAGE);
      console.log(error);
      this.setState({ validateStatus: 'error' });
    }
  };
  private handleReset = (e: React.FormEvent<any>) => {
    const { onCancel } = this.props;
    e.preventDefault();
    this.setState({ value: '', validateStatus: undefined, errorMsg: '' });
    return onCancel && onCancel();
  };

  public render(): React.ReactNode {
    const { showCancel, gutterBottom, submitPlaceholder } = this.props;
    const { value, validateStatus, errorMsg } = this.state;
    return (
      <Form
        onSubmit={this.handleSubmit}
        style={{ overflow: 'hidden', marginBottom: gutterBottom }}
        onReset={this.handleReset}
      >
        <Form.Item
          validateStatus={validateStatus}
          help={errorMsg}
          hasFeedback={true}
        >
          <Input.TextArea
            placeholder="댓글을 입력해주세요"
            value={value}
            onChange={this.handleChange}
            autosize={{ minRows: 3, maxRows: 12 }}
          />
        </Form.Item>
        <Form.Item style={{ float: 'right', marginBottom: 0 }}>
          <Button
            htmlType="submit"
            type="primary"
            disabled={
              validateStatus === 'error' || validateStatus === 'validating'
                ? true
                : false
            }
          >
            {submitPlaceholder}
          </Button>
          {showCancel && (
            <Button htmlType="reset" style={{ marginLeft: 8 }}>
              취소
            </Button>
          )}
        </Form.Item>
      </Form>
    );
  }
}

export default CommentForm;

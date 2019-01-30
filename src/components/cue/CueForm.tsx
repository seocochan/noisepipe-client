import * as React from 'react';

import { Button, Form, Icon, Input, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { ICueRequest, ICueResponse } from 'payloads';
import { secondsToString, stringToSeconds } from 'utils/common';
import { DEFAULT_ERROR_MESSAGE, MAX_CUE_TEXT_LENGTH } from 'values';

interface Props extends FormComponentProps {
  submitPlaceholder: string;
  showCancel?: boolean;
  cue?: ICueResponse;
  onLoadSeconds?: () => number;
  onSubmit: (data: ICueRequest) => Promise<void>;
  onAfterSubmit?: () => void;
  onCancel?: () => void;
}

class CueForm extends React.Component<Props, {}> {
  public static defaultProps = {
    showCancel: false
  };

  public componentDidMount() {
    const {
      cue,
      onLoadSeconds,
      form: { setFieldsValue }
    } = this.props;

    // manually set initialValue of 'seconds' field,
    // to avoid unwanted update when onChange occurs
    setFieldsValue({
      ['seconds']: secondsToString(
        (cue && cue.seconds) || (onLoadSeconds && onLoadSeconds()) || 0
      )
    });
  }

  private handleSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault();
    const {
      onSubmit,
      onAfterSubmit,
      form: { validateFields, resetFields }
    } = this.props;

    validateFields(async (err, values: { text: string; seconds: string }) => {
      if (err) {
        return;
      }
      try {
        await onSubmit({
          text: values.text,
          seconds: stringToSeconds(values.seconds)
        });
      } catch (error) {
        message.error(DEFAULT_ERROR_MESSAGE);
      }
      resetFields();
      if (onAfterSubmit) {
        onAfterSubmit();
      }
    });
  };

  public render() {
    const {
      submitPlaceholder,
      showCancel = false,
      cue,
      onCancel,
      form: { getFieldDecorator }
    } = this.props;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item>
          {getFieldDecorator('seconds', {
            rules: [
              {
                message: `'m:ss' 형태로 입력하세요`,
                pattern: /^\d*:[0-5]\d$/
              }
            ]
          })(
            <Input
              prefix={
                <Icon
                  type="clock-circle"
                  style={{ color: 'rgba(0,0,0,.25)' }}
                />
              }
              placeholder="m:ss"
              style={{ width: 80 }}
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('text', {
            initialValue: (cue && cue.text) || '',
            rules: [
              {
                message: '내용을 입력하세요',
                whitespace: true
              },
              {
                max: MAX_CUE_TEXT_LENGTH,
                message: `${MAX_CUE_TEXT_LENGTH}자 이하로 작성해주세요`
              }
            ]
          })(
            <Input.TextArea
              placeholder="내용"
              autosize={{ minRows: 1, maxRows: 3 }}
            />
          )}
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button htmlType="submit" type="primary">
            {submitPlaceholder}
          </Button>
          {showCancel && (
            <Button
              htmlType="button"
              onClick={onCancel}
              style={{ marginLeft: 8 }}
            >
              취소
            </Button>
          )}
        </div>
      </Form>
    );
  }
}

export default Form.create()(CueForm);

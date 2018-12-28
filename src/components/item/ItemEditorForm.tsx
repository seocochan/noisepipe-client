import * as React from 'react';

import { Button, Form, Icon, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { IItemResponse } from 'payloads';

interface Props extends FormComponentProps {
  item: IItemResponse;
  handleSubmit: (values: any) => void;
}

const ItemEditorForm: React.SFC<Props> = ({
  item,
  handleSubmit: submit,
  form: { getFieldDecorator, validateFields }
}) => {
  const handleSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        submit(values);
      } else {
        console.log('error', values);
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item>
        {getFieldDecorator('title', {
          initialValue: item.title,
          rules: [
            {
              required: true,
              whitespace: true,
              message: '제목을 입력하세요'
            },
            { max: 40, message: '40자 이하로 작성해주세요' }
          ]
        })(
          <Input
            prefix={<Icon type="form" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="제목"
            size="large"
          />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('description', {
          initialValue: item.description,
          rules: [
            {
              required: true,
              whitespace: true,
              message: '설명을 입력하세요'
            },
            { max: 255, message: '255자 이하로 작성해주세요' }
          ]
        })(<Input.TextArea placeholder="내용" autosize={{ minRows: 4 }} />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('tags', {
          initialValue: ['태그1', '태그2'],
          rules: [
            {
              required: false,
              message: '5개 이하의 태그를 추가해주세요',
              type: 'array',
              max: 5
            }
          ]
        })(
          <Select
            mode="tags"
            placeholder="태그를 추가하세요"
            maxTagCount={5}
            tokenSeparators={[',']}
          />
        )}
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" style={{ marginTop: 8 }}>
          완료
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create()(ItemEditorForm);

import * as React from 'react';

import { Button, Form, Icon, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { IItemPutRequest, IItemResponse } from 'payloads';

interface Props extends FormComponentProps {
  item: IItemResponse;
  handleSubmit: (itemId: number, data: IItemPutRequest) => void;
}

/**
 * FIXME:
 * - submit 동작 이후 item이 바뀌었을 때 initialValue가 업데이트 되지 않는 문제 발생
 * - ItemEditor에서 Form.create()로 매번 이 컴포넌트를 생성하는 방법으로 해결 했으나 성능 문제 우려
 * - 이 컴포넌트를 class 컴포넌트로 바꾸고, cdu에서 props.item 변경 감지후, form.resetFields() 호출하도록 수정 필요
 *
 * TODO:
 * - 개별 tag 문자열의 길이 제한
 * - 개별 tag 문자열 trim
 */

const ItemEditorForm: React.SFC<Props> = ({
  item,
  handleSubmit: submit,
  form: { getFieldDecorator, validateFields }
}) => {
  const handleSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        submit(item.id, values);
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
              message: '제목을 입력하세요',
              required: true,
              whitespace: true
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
              message: '설명을 입력하세요',
              whitespace: true
            },
            { max: 255, message: '255자 이하로 작성해주세요' }
          ]
        })(<Input.TextArea placeholder="내용" autosize={{ minRows: 4 }} />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('tags', {
          initialValue: item.tags,
          rules: [
            {
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

export default ItemEditorForm;

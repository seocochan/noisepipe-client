import * as React from 'react';

import { Button, Form, Icon, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { IItemPutRequest, IItemResponse } from 'payloads';
import { MAX_ITEM_DESCRIPTION_LENGTH, MAX_ITEM_TAGS_SIZE, MAX_ITEM_TITLE_LENGTH } from 'values';

interface Props extends FormComponentProps {
  item: IItemResponse;
  items: IItemResponse[];
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

const ItemEditorForm: React.FC<Props> = ({
  item,
  items,
  handleSubmit: submit,
  form: { getFieldDecorator, validateFields },
}) => {
  const handleSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        submit(item.id, values);
      }
    });
  };

  const currentTags = new Set(item.tags);
  const othersTags = new Set(items.reduce((prev, i) => [...prev, ...i.tags], []));
  const suggestionTags = new Set([...othersTags].filter((otherTag) => !currentTags.has(otherTag)));

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item>
        {getFieldDecorator('title', {
          initialValue: item.title,
          rules: [
            {
              message: '제목을 입력하세요',
              required: true,
              whitespace: true,
            },
            {
              max: MAX_ITEM_TITLE_LENGTH,
              message: `${MAX_ITEM_TITLE_LENGTH}자 이하로 작성해주세요`,
            },
          ],
        })(
          <Input prefix={<Icon type="form" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="제목" size="large" />,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('description', {
          initialValue: item.description,
          rules: [
            {
              message: '설명을 입력하세요',
              whitespace: true,
            },
            {
              max: MAX_ITEM_DESCRIPTION_LENGTH,
              message: `${MAX_ITEM_DESCRIPTION_LENGTH}자 이하로 작성해주세요`,
            },
          ],
        })(<Input.TextArea placeholder="설명" autosize={{ minRows: 4 }} />)}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('tags', {
          initialValue: item.tags,
          rules: [
            {
              message: `${MAX_ITEM_TAGS_SIZE}개 이하의 태그를 추가해주세요`,
              type: 'array',
              max: MAX_ITEM_TAGS_SIZE,
            },
          ],
        })(
          <Select mode="tags" placeholder="태그를 추가하세요" maxTagCount={MAX_ITEM_TAGS_SIZE} tokenSeparators={[',']}>
            {[...suggestionTags].map((tag, i) => (
              <Select.Option key={i.toString()} value={tag}>
                {tag}
              </Select.Option>
            ))}
          </Select>,
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

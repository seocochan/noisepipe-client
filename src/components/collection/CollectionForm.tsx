import * as React from 'react';

import { Button, Form, Icon, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { ICollectionRequest } from 'payloads';
import { MAX_COLLECTION_DESCRIPTION_LENGTH, MAX_COLLECTION_TAGS_SIZE, MAX_COLLECTION_TITLE_LENGTH } from 'values';

import styles from './CollectionForm.module.less';

interface Props extends FormComponentProps {
  collection?: ICollectionRequest;
  handleSubmit: (collection: ICollectionRequest) => void;
  onAfterReset?: () => void;
}

const CollectionForm: React.SFC<Props> = ({
  collection,
  handleSubmit: submit,
  onAfterReset,
  form: { getFieldDecorator, validateFields, resetFields }
}) => {
  const handleSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault();
    validateFields((err, values: ICollectionRequest) => {
      if (!err) {
        submit(values);
        resetFields();
        if (onAfterReset) {
          onAfterReset();
        }
      }
    });
  };
  const handleCancel = () => {
    if (onAfterReset) {
      onAfterReset();
    }
  };

  return (
    <div style={{ maxWidth: 768, margin: 'auto' }}>
      <Form onSubmit={handleSubmit}>
        <Form.Item>
          {getFieldDecorator('title', {
            initialValue: collection && collection.title,
            rules: [
              {
                message: '제목을 입력하세요',
                required: true,
                whitespace: true
              },
              {
                max: MAX_COLLECTION_TITLE_LENGTH,
                message: `${MAX_COLLECTION_TITLE_LENGTH}자 이하로 작성해주세요`
              }
            ]
          })(
            <Input
              prefix={<Icon type="form" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="제목"
              size="large"
              autoFocus={true}
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('description', {
            initialValue: collection && collection.description,
            rules: [
              {
                message: '설명을 입력하세요',
                whitespace: true
              },
              {
                max: MAX_COLLECTION_DESCRIPTION_LENGTH,
                message: `${MAX_COLLECTION_DESCRIPTION_LENGTH}자 이하로 작성해주세요`
              }
            ]
          })(<Input.TextArea placeholder="설명" autosize={{ minRows: 4 }} />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('tags', {
            initialValue: collection && collection.tags,
            rules: [
              {
                message: `${MAX_COLLECTION_TAGS_SIZE}개 이하의 태그를 추가해주세요`,
                type: 'array',
                max: MAX_COLLECTION_TAGS_SIZE
              }
            ]
          })(
            <Select
              mode="tags"
              placeholder="태그를 추가하세요"
              maxTagCount={MAX_COLLECTION_TAGS_SIZE}
              tokenSeparators={[',']}
            />
          )}
        </Form.Item>
        <div className={styles.buttonContainer}>
          <Button htmlType="submit" style={{ marginRight: 8 }}>
            완료
          </Button>
          <Button htmlType="button" onClick={handleCancel}>
            취소
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Form.create()(CollectionForm);

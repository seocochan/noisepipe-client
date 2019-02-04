import * as React from 'react';

import { Button, Form, Icon, Input, Tooltip } from 'antd';
import { FormItemProps } from 'antd/lib/form';
import { Provider } from 'types';
import * as ItemAPI from 'utils/api/item';
import { MAX_COLLECTION_ITEMS_SIZE } from 'values';

interface Props {
  handleAddItem: (
    title: string,
    sourceUrl: string,
    sourceProvider: Provider
  ) => void;
  disabled: boolean;
}
interface State {
  value: string;
  validateStatus: FormItemProps['validateStatus'];
  errorMsg: string;
}

class ItemAddForm extends React.Component<Props, State> {
  public static defaultProps = {
    disabled: false
  };
  public readonly state: State = {
    value: '',
    validateStatus: undefined,
    errorMsg: ''
  };

  private validate = (value: string) => {
    const MATCH_URL_YT = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/;
    const MATCH_URL_SC = /(soundcloud\.com|snd\.sc)\/.+$/;

    if (MATCH_URL_YT.test(value)) {
      return Provider.Youtube;
    } else if (MATCH_URL_SC.test(value)) {
      return Provider.Soundcloud;
    } else {
      return;
    }
  };
  private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.currentTarget.value });
  };
  private handleSubmit = async (e: React.FormEvent<any>) => {
    e.preventDefault();
    const { handleAddItem } = this.props;
    const { value } = this.state;
    const validProvider = this.validate(value);
    if (!validProvider) {
      return this.setState({
        validateStatus: 'error',
        errorMsg: '올바른 URL을 입력해주세요'
      });
    }
    this.setState({ validateStatus: 'validating', errorMsg: '' });
    try {
      const res = await ItemAPI.getMediaData(value, validProvider);
      const { url, title } = res.data;
      handleAddItem(title, url, validProvider);
      this.setState({ value: '', validateStatus: undefined, errorMsg: '' });
    } catch (error) {
      console.log(error);
      this.setState({
        validateStatus: 'error',
        errorMsg: '미디어 정보를 찾을 수 없습니다'
      });
    }
  };

  public render(): React.ReactNode {
    const { disabled } = this.props;
    const { value, validateStatus, errorMsg } = this.state;
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <Form.Item
          validateStatus={validateStatus}
          help={errorMsg}
          hasFeedback={true}
          style={{ marginRight: 8 }}
        >
          <Input
            disabled={disabled}
            prefix={<Icon type="link" />}
            placeholder="미디어 URL"
            value={value}
            onChange={this.handleChange}
            style={{ width: 200 }}
          />
        </Form.Item>
        <Form.Item>
          <Button disabled={disabled} htmlType="submit" icon="plus" />
        </Form.Item>
        {disabled && (
          <Tooltip
            title={`최대 ${MAX_COLLECTION_ITEMS_SIZE}개까지의 아이템을 추가할 수 있어요`}
          >
            <Icon type="info-circle" style={{ color: '#f5222d' }} />
          </Tooltip>
        )}
      </Form>
    );
  }
}

export default ItemAddForm;

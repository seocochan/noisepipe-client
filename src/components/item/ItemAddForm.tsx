import * as React from 'react';

import { Button, Form, Icon, Input } from 'antd';
import { FormItemProps } from 'antd/lib/form';
import { Provider } from 'types';
import * as ItemAPI from 'utils/api/item';

interface Props {
  handleAddItem: (
    title: string,
    sourceUrl: string,
    sourceProvider: Provider
  ) => void;
}
interface State {
  value: string;
  validateStatus: FormItemProps['validateStatus'];
  errorMsg: string;
}

class ItemAddForm extends React.Component<Props, State> {
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
            prefix={<Icon type="link" />}
            placeholder="미디어 URL"
            value={value}
            onChange={this.handleChange}
            style={{ width: 200 }}
          />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" icon="plus" />
        </Form.Item>
      </Form>
    );
  }
}

export default ItemAddForm;

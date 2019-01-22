import * as React from 'react';

import { Icon, Input } from 'antd';

import styles from './ItemFilterInput.module.less';

interface Props {}
interface State {
  value: string;
}

class ItemFilterInput extends React.Component<Props, State> {
  public readonly state: State = {
    value: ''
  };

  public render(): React.ReactNode {
    const { value } = this.state;

    return (
      <Input
        className={styles.filter}
        prefix={<Icon type="search" />}
        placeholder="필터"
        value={value}
        onChange={e => this.setState({ value: e.currentTarget.value })}
        disabled={true}
      />
    );
  }
}

export default ItemFilterInput;

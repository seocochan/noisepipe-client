import * as React from 'react';

import { Icon, Input } from 'antd';

import styles from './ItemFilterInput.module.less';

interface Props {
  toggleFilterActive: (active: boolean) => void;
  filterItems: (value: string) => void;
}
interface State {
  value: string;
}

class ItemFilterInput extends React.Component<Props, State> {
  public readonly state: State = {
    value: ''
  };

  private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { toggleFilterActive, filterItems } = this.props;
    const { value } = e.currentTarget;
    this.setState({ value });

    if (value.trim().length > 0) {
      toggleFilterActive(true);
      filterItems(value);
    } else {
      toggleFilterActive(false);
    }
  };

  public render(): React.ReactNode {
    const { value } = this.state;

    return (
      <Input
        className={styles.filter}
        prefix={<Icon type="search" />}
        placeholder="필터"
        value={value}
        onChange={this.handleChange}
        allowClear={true}
      />
    );
  }
}

export default ItemFilterInput;

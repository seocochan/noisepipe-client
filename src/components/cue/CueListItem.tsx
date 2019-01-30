import * as React from 'react';

import { Button, Dropdown, List, Menu, message, Popconfirm } from 'antd';
import { ICueResponse } from 'payloads';
import { CueFormProps } from 'types';
import { secondsToString } from 'utils/common';
import { DEFAULT_ERROR_MESSAGE } from 'values';

import styles from './CueListItem.module.less';

interface Props {
  cue: ICueResponse;
  renderCueForm: (props: CueFormProps) => React.ReactNode;
  onClick: () => void;
  onRemove: () => Promise<void>;
}
interface State {
  showEditForm: boolean;
}

class CueListItem extends React.Component<Props, State> {
  public readonly state: State = {
    showEditForm: false
  };

  private handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const { onClick } = this.props;
    onClick();
  };
  private handleRemove = async () => {
    const { onRemove } = this.props;
    try {
      await onRemove();

      message.success('큐를 삭제했습니다');
    } catch (error) {
      message.error(DEFAULT_ERROR_MESSAGE);
      console.log(error);
    }
  };
  private editActions = () => {
    return (
      <Menu>
        <Menu.Item
          key="edit"
          onClick={() => this.setState({ showEditForm: true })}
        >
          수정
        </Menu.Item>
        <Menu.Item key="remove">
          <Popconfirm title="삭제할까요?" onConfirm={this.handleRemove}>
            삭제
          </Popconfirm>
        </Menu.Item>
      </Menu>
    );
  };

  public render(): React.ReactNode {
    const { cue, renderCueForm } = this.props;
    const { showEditForm } = this.state;

    return (
      <List.Item>
        {showEditForm ? (
          renderCueForm({
            onAfterSubmit: () => this.setState({ showEditForm: false }),
            onCancel: () => this.setState({ showEditForm: false })
          })
        ) : (
          <List.Item.Meta
            title={
              <div className={styles.titleContainer}>
                <a className={styles.title} onClick={this.handleClick}>
                  <span>{secondsToString(cue.seconds)}</span>
                </a>
                <Dropdown trigger={['click']} overlay={this.editActions()}>
                  <Button
                    shape="circle"
                    icon="ellipsis"
                    size="small"
                    style={{ background: 'transparent' }}
                  />
                </Dropdown>
              </div>
            }
            description={cue.text}
          />
        )}
      </List.Item>
    );
  }
}

export default CueListItem;

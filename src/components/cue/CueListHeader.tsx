import * as React from 'react';

import { Button } from 'antd';
import { CueFormProps } from 'types';

import styles from './CueListHeader.module.less';

interface Props {
  count: number;
  showEditables: boolean;
  renderCueForm: (props: CueFormProps) => React.ReactNode;
}
interface State {
  showForm: boolean;
}

class CueListHeader extends React.Component<Props, State> {
  public readonly state: State = {
    showForm: false
  };

  public render(): React.ReactNode {
    const { count, showEditables, renderCueForm } = this.props;
    const { showForm } = this.state;

    return (
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          {showEditables && (
            <Button
              className={styles.addButton}
              icon={showForm ? 'close' : 'plus'}
              shape="circle"
              onClick={() => this.setState({ showForm: !showForm })}
            />
          )}
          <h3 className={styles.title}>{`${count}개의 큐`}</h3>
        </div>
        <div className={styles.formContainer}>
          {showForm &&
            renderCueForm({
              onAfterSubmit: () => this.setState({ showForm: false }),
              onCancel: () => this.setState({ showForm: false })
            })}
        </div>
      </div>
    );
  }
}

export default CueListHeader;

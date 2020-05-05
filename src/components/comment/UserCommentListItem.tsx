import * as React from 'react';
import { Link } from 'react-router-dom';

import { Comment, Icon, message, Popconfirm } from 'antd';
import moment from 'moment';
import { ICommentRequest, ICommentSummary } from 'payloads';
import { DEFAULT_ERROR_MESSAGE } from 'values';

import CommentForm from './CommentForm';
import styles from './UserCommentListItem.module.less';

interface Props {
  comment: ICommentSummary;
  showEditActions: boolean;
  onUpdate: (commentId: number, data: ICommentRequest) => Promise<void>;
  onRemove: (commentId: number) => Promise<void>;
}
interface State {
  showEditForm: boolean;
}

class UserCommentListItem extends React.Component<Props, State> {
  public readonly state: State = {
    showEditForm: false,
  };

  public componentDidUpdate(prevProps: Props) {
    const { comment } = this.props;
    if (comment.id !== prevProps.comment.id) {
      this.setState({ showEditForm: false });
    }
  }

  private handleRemove = async () => {
    const { comment, onRemove } = this.props;
    try {
      await onRemove(comment.id);

      message.success('댓글을 삭제했습니다');
    } catch (error) {
      message.error(DEFAULT_ERROR_MESSAGE);
      console.log(error);
    }
  };

  public render(): React.ReactNode {
    const {
      comment: { id, text, collectionId, collectionTitle, createdAt },
      showEditActions,
      onUpdate,
    } = this.props;
    const { showEditForm } = this.state;

    return (
      <Comment
        author={
          <Link to={`/collections/${collectionId}`}>
            <span>{collectionTitle}</span>
          </Link>
        }
        datetime={moment(createdAt).fromNow()}
        content={
          showEditForm ? (
            <div className={styles.formContainer}>
              <CommentForm
                text={text}
                submitPlaceholder="수정"
                showCancel={true}
                onSubmit={(data) => onUpdate(id, data)}
                onCancel={() => this.setState({ showEditForm: false })}
                onSuccess={() => this.setState({ showEditForm: false })}
              />
            </div>
          ) : (
            <p>{text}</p>
          )
        }
        actions={
          showEditActions
            ? [
                <span key="edit" onClick={() => this.setState({ showEditForm: true })}>
                  수정
                  <Icon className={styles.icon} type="edit" />
                </span>,
                <span key="delete">
                  <Popconfirm title="댓글을 삭제할까요?" onConfirm={this.handleRemove}>
                    삭제
                    <Icon className={styles.icon} type="delete" />
                  </Popconfirm>
                </span>,
              ]
            : undefined
        }
      />
    );
  }
}

export default UserCommentListItem;

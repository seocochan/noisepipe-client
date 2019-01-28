import * as React from 'react';
import { Link } from 'react-router-dom';

import { Button, Comment, Dropdown, Icon, Menu, message, Popconfirm } from 'antd';
import * as moment from 'moment';
import { ICommentRequest, ICommentResponse } from 'payloads';
import { AuthState } from 'store/modules/auth';
import { DEFAULT_ERROR_MESSAGE } from 'values';

import CommentForm from './CommentForm';
import styles from './CommentListItem.module.less';

interface Props {
  comment: ICommentResponse;
  replyTo?: number;
  currentUser: AuthState['currentUser'];
  showReplyActions: boolean;
  onCreate: (data: ICommentRequest) => Promise<void>;
  onUpdate: (commentId: number, data: ICommentRequest) => Promise<void>;
  onRemove: (commentId: number, replyTo?: number) => Promise<void>;
}
interface State {
  showReplies: boolean;
  showEditForm: boolean;
  showReplyForm: boolean;
}

class CommentListItem extends React.Component<Props, State> {
  public readonly state: State = {
    showReplies: false,
    showEditForm: false,
    showReplyForm: false
  };

  public componentDidUpdate(prevProps: Props) {
    const { comment } = this.props;
    if (comment.id !== prevProps.comment.id) {
      this.setState({
        showReplies: false,
        showEditForm: false,
        showReplyForm: false
      });
    }
  }

  private handleRemove = async () => {
    const { comment, onRemove, replyTo } = this.props;
    try {
      await onRemove(comment.id, replyTo);

      message.success('댓글을 삭제했습니다');
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

  public render() {
    const {
      comment: { id, createdBy, text, createdAt, replies },
      replyTo,
      currentUser,
      showReplyActions,
      onCreate,
      onUpdate,
      children
    } = this.props;
    const { showReplies, showReplyForm, showEditForm } = this.state;

    return (
      <Comment
        author={
          <>
            <Link to={`/@${createdBy.username}`}>
              {currentUser && currentUser.id === createdBy.id ? (
                <span>
                  <Icon type="user" /> {createdBy.username}
                </span>
              ) : (
                <span>{createdBy.username}</span>
              )}
            </Link>
            {currentUser && currentUser.id === createdBy.id && (
              <div className={styles.editActions}>
                <Dropdown trigger={['click']} overlay={this.editActions()}>
                  <Button shape="circle" icon="ellipsis" size="small" />
                </Dropdown>
              </div>
            )}
          </>
        }
        datetime={moment(createdAt).fromNow()}
        content={
          showEditForm ? (
            <div className={styles.formContainer}>
              <CommentForm
                text={text}
                replyTo={replyTo}
                submitPlaceholder="수정"
                showCancel={true}
                onSubmit={data => onUpdate(id, data)}
                onCancel={() => this.setState({ showEditForm: false })}
                onSuccess={() => this.setState({ showEditForm: false })}
              />
            </div>
          ) : (
            <p>{text}</p>
          )
        }
        actions={
          showReplyActions
            ? [
                <span
                  key="reply-view"
                  onClick={() => this.setState({ showReplies: !showReplies })}
                >
                  {`답글 ${replies}개`}
                  <Icon
                    className={styles.icon}
                    type={showReplies ? 'up' : 'down'}
                  />
                </span>,
                <span
                  key="add"
                  onClick={() =>
                    this.setState({ showReplyForm: !showReplyForm })
                  }
                >
                  답글 달기
                  <Icon
                    className={styles.icon}
                    type={showReplyForm ? 'rollback' : 'enter'}
                  />
                </span>
              ]
            : undefined
        }
      >
        {showReplyForm && (
          <div className={styles.formContainer}>
            <CommentForm
              replyTo={id}
              showCancel={true}
              onSubmit={onCreate}
              onCancel={() => this.setState({ showReplyForm: false })}
              onSuccess={() =>
                this.setState({ showReplyForm: false, showReplies: true })
              }
            />
          </div>
        )}
        {showReplies && children}
      </Comment>
    );
  }
}

export default CommentListItem;

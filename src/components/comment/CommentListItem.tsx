import * as React from 'react';
import { Link } from 'react-router-dom';

import { Button, Comment, Dropdown, Icon, Menu } from 'antd';
import * as moment from 'moment';
import { ICommentResponse } from 'payloads';

import styles from './CommentListItem.module.less';

interface Props {
  comment: ICommentResponse;
  showReplyActions: boolean;
}
interface State {
  showReplies: boolean;
}

class CommentListItem extends React.Component<Props, State> {
  public readonly state: State = {
    showReplies: false
  };

  public render() {
    const {
      comment: { createdBy, text, createdAt, replies },
      showReplyActions,
      children
    } = this.props;
    const { showReplies } = this.state;

    return (
      <Comment
        author={
          <>
            <Link to={`/@${createdBy.username}`}>{createdBy.username}</Link>
            <div className={styles.editActions}>
              <Dropdown
                trigger={['click']}
                overlay={
                  <Menu>
                    <Menu.Item>수정</Menu.Item>
                    <Menu.Item>삭제</Menu.Item>
                  </Menu>
                }
              >
                <Button shape="circle" icon="ellipsis" size="small"/>
              </Dropdown>
            </div>
          </>
        }
        datetime={moment(createdAt).fromNow()}
        content={<p>{text}</p>}
        actions={
          showReplyActions
            ? [
                <span
                  key="reply-view"
                  onClick={() =>
                    replies > 0 && this.setState({ showReplies: !showReplies })
                  }
                >
                  {`답글 ${replies}개`}
                  <Icon
                    className={styles.icon}
                    type={showReplies ? 'up' : 'down'}
                  />
                </span>,
                <span key="add">
                  답글 달기
                  <Icon className={styles.icon} type="enter" />
                </span>
              ]
            : undefined
        }
      >
        {showReplies && children}
      </Comment>
    );
  }
}

export default CommentListItem;

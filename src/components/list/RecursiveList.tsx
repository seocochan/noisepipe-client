import * as React from 'react';

import { List } from 'antd';
import { CommentListItem } from 'components/comment';
import { ICommentRequest, ICommentResponse } from 'payloads';
import { AuthState } from 'store/modules/auth';
import { MAX_COMMENT_DEPTH } from 'values';

interface Props {
  depth: number;
  comments?: ICommentResponse[];
  replies?: Map<ICommentResponse['id'], ICommentResponse[]>;
  parentCommentId?: ICommentResponse['id'];
  currentUser: AuthState['currentUser'];
  onLoad: (commentId: number) => void;
  onCreate: (data: ICommentRequest) => Promise<void>;
  onUpdate: (commentId: number, data: ICommentRequest) => Promise<void>;
  onRemove: (commentId: number, replyTo?: number) => Promise<void>;
}

class RecursiveList extends React.Component<Props, {}> {
  public componentDidMount() {
    const { parentCommentId, onLoad } = this.props;
    if (!parentCommentId || !onLoad) {
      return;
    }
    onLoad(parentCommentId);
  }

  public render(): React.ReactNode {
    const { comments, replies, parentCommentId, currentUser, depth, onLoad, onCreate, onUpdate, onRemove } = this.props;

    return (
      <List
        dataSource={comments}
        renderItem={(comment: ICommentResponse) => (
          <CommentListItem
            key={comment.id}
            comment={comment}
            replyTo={parentCommentId}
            currentUser={currentUser}
            showReplyActions={depth < MAX_COMMENT_DEPTH}
            onCreate={onCreate}
            onUpdate={onUpdate}
            onRemove={onRemove}
          >
            <RecursiveList
              key={comment.id}
              depth={depth + 1}
              comments={replies && replies.get(comment.id)}
              parentCommentId={comment.id}
              currentUser={currentUser}
              onLoad={onLoad}
              onCreate={onCreate}
              onUpdate={onUpdate}
              onRemove={onRemove} // FIXME: ...this.props
            />
          </CommentListItem>
        )}
      />
    );
  }
}

export default RecursiveList;

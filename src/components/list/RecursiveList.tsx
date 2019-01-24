import * as React from 'react';

import { List } from 'antd';
import { CommentListItem } from 'components/comment';
import { ICommentResponse } from 'payloads';
import { MAX_COMMENT_DEPTH } from 'values';

interface Props {
  depth: number;
  comments?: ICommentResponse[];
  replies?: Map<ICommentResponse['id'], ICommentResponse[]>;
  parentCommentId?: ICommentResponse['id'];
  onLoadReplies: (commentId: number) => void;
}

class RecursiveList extends React.Component<Props, {}> {
  public componentDidMount() {
    const { parentCommentId, onLoadReplies } = this.props;
    if (!parentCommentId || !onLoadReplies) {
      return;
    }
    onLoadReplies(parentCommentId);
  }

  public render(): React.ReactNode {
    const {
      comments,
      replies,
      depth,
      parentCommentId,
      onLoadReplies
    } = this.props;

    if (depth > MAX_COMMENT_DEPTH) {
      return null;
    }

    console.log('--------------------');
    console.log(depth, parentCommentId);
    console.log(comments);

    return (
      <List
        dataSource={comments}
        renderItem={(comment: ICommentResponse) => (
          <CommentListItem
            comment={comment}
            showReplyActions={depth < MAX_COMMENT_DEPTH}
          >
            <RecursiveList
              depth={depth + 1}
              comments={replies && replies.get(comment.id)}
              parentCommentId={comment.id}
              onLoadReplies={onLoadReplies}
            />
          </CommentListItem>
        )}
      />
    );
  }
}

export default RecursiveList;

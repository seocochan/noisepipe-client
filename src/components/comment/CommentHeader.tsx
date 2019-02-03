import * as React from 'react';

interface Props {
  comments: number;
}

const CommentHeader: React.FC<Props> = ({ comments }) => {
  return <h2>{comments}개의 댓글</h2>;
};

export default CommentHeader;

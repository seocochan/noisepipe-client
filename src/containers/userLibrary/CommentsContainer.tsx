import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { List, message } from 'antd';
import { CollectionsHeader } from 'components/collection';
import { UserCommentListItem } from 'components/comment';
import { LoadingIndicator } from 'components/common';
import { LoadMoreButton } from 'components/list';
import { ICommentRequest, ICommentSummary } from 'payloads';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { AuthState } from 'store/modules/auth';
import { actions as userLibraryActions, UserLibraryState } from 'store/modules/userLibrary';
import { DEFAULT_ERROR_MESSAGE, DEFAULT_PAGE_SIZE } from 'values';

interface Props extends RouteComponentProps {
  currentTab: string;
  tabName: string;
  username: string;
  currentUser: AuthState['currentUser'];
  comments: UserLibraryState['comments'];
  UserLibraryActions: typeof userLibraryActions;
}

class CommentsContainer extends React.Component<Props, {}> {
  public async componentDidMount() {
    const { username, UserLibraryActions, history } = this.props;
    try {
      await UserLibraryActions.loadComments(username);
    } catch (error) {
      message.error(DEFAULT_ERROR_MESSAGE);
      history.replace('/404');
    }
  }
  public componentDidUpdate(prevProps: Props) {
    const { currentTab, tabName, username, UserLibraryActions } = this.props;
    if (currentTab !== prevProps.currentTab) {
      if (currentTab === tabName) {
        UserLibraryActions.loadComments(username);
      } else {
        UserLibraryActions.initialize();
      }
    }
  }
  public componentWillUnmount() {
    const { UserLibraryActions } = this.props;
    UserLibraryActions.initialize();
  }

  private getOffsetId = () => {
    const { comments } = this.props;
    return !comments ? -1 : comments.content[comments.content.length - 1].id;
  };
  private loadMore = async () => {
    const { UserLibraryActions, username } = this.props;
    const offsetId = this.getOffsetId();

    await UserLibraryActions.loadComments(
      username,
      offsetId === -1 ? undefined : offsetId,
      DEFAULT_PAGE_SIZE,
      true
    );
  };
  private handleUpdateComment = async (
    commentId: number,
    data: ICommentRequest
  ) => {
    const { UserLibraryActions } = this.props;
    try {
      await UserLibraryActions.updateComment(commentId, data);
    } catch (error) {
      throw error;
    }
  };
  private handleRemoveComment = async (commentId: number) => {
    const { UserLibraryActions } = this.props;
    try {
      await UserLibraryActions.removeComment(commentId);
    } catch (error) {
      throw error;
    }
  };

  public render(): React.ReactNode {
    const { comments, username, currentUser } = this.props;

    if (!comments) {
      return <LoadingIndicator />;
    }
    return (
      <>
        <CollectionsHeader count={comments.totalElements} name={'댓글'} />
        <List
          dataSource={comments.content}
          renderItem={(comment: ICommentSummary) => (
            <UserCommentListItem
              key={comment.id}
              comment={comment}
              showEditActions={
                currentUser ? currentUser.username === username : false
              }
              onUpdate={this.handleUpdateComment}
              onRemove={this.handleRemoveComment}
            />
          )}
          loadMore={
            !comments.last && <LoadMoreButton loadMore={this.loadMore} />
          }
        />
      </>
    );
  }
}

const mapStateToProps = ({ auth, userLibrary }: RootState) => ({
  currentUser: auth.currentUser,
  comments: userLibrary.comments
});
const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  UserLibraryActions: bindActionCreators(userLibraryActions, dispatch)
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CommentsContainer)
);

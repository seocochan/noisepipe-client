import * as React from 'react';
import { connect } from 'react-redux';

import { Divider, Icon } from 'antd';
import { LoadingIndicator, Title } from 'components/common';
import { UpdatePasswordForm } from 'components/user';
import { IPasswordUpdateRequest } from 'payloads';
import { bindActionCreators, Dispatch } from 'redux';
import { RootAction, RootState } from 'store';
import { actions as authActions, AuthState } from 'store/modules/auth';

interface Props {
  currentUser: AuthState['currentUser'];
  AuthActions: typeof authActions;
}

class UserSettingContainer extends React.Component<Props, {}> {
  private handleSubmit = async (data: IPasswordUpdateRequest) => {
    const { AuthActions } = this.props;
    try {
      await AuthActions.updatePassword(data);
    } catch (error) {
      throw error;
    }
  };

  public render(): React.ReactNode {
    const { currentUser } = this.props;

    if (!currentUser) {
      return <LoadingIndicator />;
    }
    return (
      <>
        <Title
          text={
            <>
              <span>계정 설정</span>
              <span style={{ color: 'rgba(0, 0, 0, 0.65)', marginLeft: 8 }}>
                @{currentUser.username}
              </span>
            </>
          }
          prefix={<Icon type="user" />}
        />
        <Divider />
        <div style={{ maxWidth: 420, margin: 'auto' }}>
          <h3>비밀번호 변경</h3>
          <UpdatePasswordForm onSubmit={this.handleSubmit} />
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ auth }: RootState) => ({
  currentUser: auth.currentUser
});
const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
  AuthActions: bindActionCreators(authActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserSettingContainer);

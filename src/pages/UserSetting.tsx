import * as React from 'react';

import { UserSettingContainer } from 'containers/userSetting';

import styles from './UserSetting.module.less';

const UserSetting: React.FC<{}> = () => {
  return (
    <div className={styles.container}>
      <UserSettingContainer />
    </div>
  );
};

export default UserSetting;

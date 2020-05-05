import * as React from 'react';
import { Link } from 'react-router-dom';

import { Card, Icon } from 'antd';
import moment from 'moment';
import { IUserProfile } from 'payloads';

import styles from './UserCard.module.less';

interface Props {
  user: IUserProfile;
}

const UserCard: React.FC<Props> = ({ user: { username, joinedAt } }) => {
  return (
    <Card>
      <Card.Meta
        title={
          <h3>
            <Link to={`/@${username}`}>{username}</Link>
          </h3>
        }
        description={
          <div className={styles.flex}>
            <span>
              <Icon type="calendar" /> 가입일
            </span>
            <span>{moment(joinedAt).format('ll')}</span>
          </div>
        }
      />
    </Card>
  );
};

export default UserCard;

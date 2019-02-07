import * as React from 'react';

import { Alert } from 'antd';

const notifications = [
  {
    title: 'Noisepipe 알파 테스트를 시작합니다',
    link: 'https://www.notion.so/Noisepipe-588c21d610f8402c8b59b802487a469c'
  }
];

const Notifications: React.FC<{}> = () => {
  return (
    <>
      {notifications.map(({ title, link }) => (
        <Alert
          message={
            <a href={link} target="_blank">
              {title}
            </a>
          }
          type="info"
          showIcon={true}
          banner={true}
          style={{ marginBottom: 8 }}
        />
      ))}
    </>
  );
};

export default Notifications;

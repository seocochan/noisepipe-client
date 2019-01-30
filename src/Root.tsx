import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import { ConfigProvider, LocaleProvider } from 'antd';
import kr_KR from 'antd/lib/locale-provider/ko_KR';
import App from 'components/App';
import store from 'store';

import 'moment/locale/ko';

const Root: React.SFC<{}> = () => (
  <Provider store={store}>
    <ConfigProvider renderEmpty={() => ''}>
      <LocaleProvider locale={kr_KR}>
        <Router>
          <App />
        </Router>
      </LocaleProvider>
    </ConfigProvider>
  </Provider>
);

export default Root;

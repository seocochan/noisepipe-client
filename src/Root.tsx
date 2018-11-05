import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import { LocaleProvider } from 'antd';
import kr_KR from 'antd/lib/locale-provider/ko_KR';
import App from 'components/App';
import store from 'store';

import 'moment/locale/ko';

const Root: React.SFC<{}> = () => (
  <Provider store={store}>
    <LocaleProvider locale={kr_KR}>
      <Router>
        <App />
      </Router>
    </LocaleProvider>
  </Provider>
);

export default Root;

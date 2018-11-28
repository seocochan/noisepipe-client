import * as React from 'react';
import { connect } from 'react-redux';
import { RouteProps } from 'react-router';
import { Redirect, Route } from 'react-router-dom';

import { RootState } from 'store';
import { AuthState } from 'store/modules/auth';

interface Props extends RouteProps {
  component: React.ComponentType<any>;
  auth: AuthState;
}

const PrivateRoute: React.SFC<Props> = ({
  component: Component,
  auth,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (auth.isLoading) {
          return null;
        }
        if (auth.isAuthenticated) {
          return <Component {...rest} {...props} />;
        }
        return (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
        );
      }}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);

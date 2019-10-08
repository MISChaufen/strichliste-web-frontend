import * as React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import { StoreContext, useDispatch } from 'redux-react-hook';

import { ArticleRouter } from './components/article/article-router';
import { en } from './locales/en';
import { ErrorMessage } from './components/common/error-message';
import { HeaderMenu } from './components/common/header-menu';
import { IntlProvider } from 'react-intl';
import { MainFooter, baseCss, mobileStyles } from './components/ui';
import { SearchResults } from './components/common/search-results';
import { SplitInvoiceForm } from './components/transaction';
import { startLoadingSettings } from './store/reducers';
import { store } from './store';
import { UserRouter } from './components/user/user-router';
import { useScalingState } from './components/settings/scaling-buttons';

// tslint:disable-next-line:no-import-side-effect
import 'inter-ui';
import { MetricsView } from './components/metrics';
import { WrappedIdleTimer } from './components/common/idle-timer';
import { ThemeProvider, ThemeSwitcher, Card } from './bricks';

const Layout = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    startLoadingSettings(dispatch);
  }, [dispatch]);

  const { scaling } = useScalingState();

  return (
    <>
      <ErrorMessage />
      <HeaderMenu />
      <Switch>
        <Route path="/user" component={UserRouter} />
        <Route
          path="/articles"
          render={() => (
            <>
              <WrappedIdleTimer />
              <ArticleRouter />
            </>
          )}
        />
        <Route
          path="/split-invoice"
          render={() => (
            <>
              <WrappedIdleTimer />
              <SplitInvoiceForm />
            </>
          )}
        />
        <Route
          path="/metrics"
          render={() => (
            <>
              <WrappedIdleTimer />
              <MetricsView />
            </>
          )}
        />
        <Route
          path="/search-results"
          render={props => (
            <>
              <WrappedIdleTimer />
              <SearchResults {...props} />
            </>
          )}
        />
        <Redirect from="/" to="/user/active" />
      </Switch>
      <div>
        SWITCHER
        <Card level="level3" padding="2rem" margin="2rem">
          This is a test
        </Card>
        <ThemeSwitcher />
        <MainFooter />
      </div>
    </>
  );
};

export class App extends React.Component {
  // tslint:disable-next-line:prefer-function-over-method
  public render(): JSX.Element {
    return (
      <ThemeProvider>
        <StoreContext.Provider value={store}>
          <IntlProvider
            textComponent={React.Fragment}
            locale="en"
            messages={en}
          >
            <HashRouter hashType="hashbang">
              <Layout />
            </HashRouter>
          </IntlProvider>
        </StoreContext.Provider>
      </ThemeProvider>
    );
  }
}

// tslint:disable-next-line:no-default-export
export default App;

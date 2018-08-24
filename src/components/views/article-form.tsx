import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { AddArticleParams, startAddArticle } from '../../store/reducers';
import { BackButton } from '../common';
import { CurrencyInput } from '../currency';
import { Button, FixedFooter, FormField, theme } from '../ui';

interface OwnProps {}

interface ActionProps {
  // tslint:disable-next-line:no-any
  addArticle(article: AddArticleParams): any;
}

type Props = OwnProps & ActionProps & RouteComponentProps<{}>;

export class ArticleForm extends React.Component<Props, AddArticleParams> {
  public state = {
    name: '',
    barcode: '',
    amount: 0,
    active: true,
    precursor: null,
  };

  public submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await this.props.addArticle(this.state);
    this.props.history.goBack();
  };

  public render(): JSX.Element {
    return (
      <>
        <form onSubmit={this.submit}>
          <FormField>
            <FormattedMessage
              id="ARTICLE_ADD_FORM_NAME_LABEL"
              children={text => (
                <input
                  value={this.state.name}
                  onChange={e => this.setState({ name: e.target.value })}
                  placeholder={text as string}
                  autoFocus={true}
                  type="text"
                  required
                />
              )}
            />
          </FormField>
          <FormField>
            <FormattedMessage
              id="ARTICLE_ADD_FORM_BARCODE_LABEL"
              children={text => (
                <input
                  value={this.state.barcode}
                  onChange={e => this.setState({ barcode: e.target.value })}
                  placeholder={text as string}
                  type="text"
                  required
                />
              )}
            />
          </FormField>
          <FormField>
            <FormattedMessage
              id="ARTICLE_ADD_FORM_AMOUNT_LABEL"
              children={text => (
                <CurrencyInput
                  placeholder={text as string}
                  onChange={amount => this.setState({ amount })}
                />
              )}
            />
          </FormField>
          <FormField>
            <Button color={theme.green} type="submit">
              <FormattedMessage id="ARTICLE_ADD_FROM_SUBMIT" />
            </Button>
          </FormField>
        </form>
        <FixedFooter>
          <BackButton />
        </FixedFooter>
      </>
    );
  }
}

const mapDispatchToProps: ActionProps = {
  addArticle: startAddArticle,
};

export const ConnectedArticleForm = connect(
  undefined,
  mapDispatchToProps
)(ArticleForm);

import { User } from '.';
import { get, post, restDelete } from '../../services/api';
import { MaybeResponse, errorHandler } from '../../services/error-handler';
import { playCashSound } from '../../services/sound';
import { Action, DefaultThunkAction } from '../action';
import { AppState, Dispatch, ThunkAction } from '../store';
import { Article } from './article';
import { userDetailsLoaded } from './user';

export interface Transaction {
  id: number;
  user: User;
  article?: Article;
  sender?: User;
  recipient?: User;
  comment?: string;
  amount: number;
  created: string;
  isDeleted: boolean;
  isDeletable: boolean;
}

export interface TransactionsResponse extends MaybeResponse {
  count?: number;
  transactions: Transaction[];
}

export interface TransactionResponse extends MaybeResponse {
  transaction: Transaction;
}

export enum TransactionTypes {
  StartLoadingTransactions = 'START_LOADING_TRANSACTIONS',
  TransactionsLoaded = 'TRANSACTIONS_LOADED',
}

export interface TransactionsLoadedAction {
  type: TransactionTypes.TransactionsLoaded;
  payload: Transaction[];
}

export function transactionsLoaded(
  payload: Transaction[]
): TransactionsLoadedAction {
  return {
    type: TransactionTypes.TransactionsLoaded,
    payload,
  };
}

export type TransactionActions = TransactionsLoadedAction;

export function startLoadingTransactions(
  userId: number,
  offset?: number,
  limit?: number
): ThunkAction<Promise<TransactionsResponse | undefined>> {
  return async (dispatch: Dispatch) => {
    const params =
      offset !== undefined && limit !== undefined
        ? `?offset=${offset}&limit=${limit}`
        : '?offset=0&limit=15';
    const promise = get(`user/${userId}/transaction${params}`);
    const data = await errorHandler<TransactionsResponse>(dispatch, {
      promise,
      defaultError: 'USER_TRANSACTIONS_LOADING_ERROR',
    });
    if (data && data.transactions) {
      dispatch(transactionsLoaded(data.transactions));
      return data;
    }
    return undefined;
  };
}

export interface CreateTransactionParams {
  amount?: number;
  articleId?: number;
  recipientId?: number;
  comment?: string;
}
export function startCreatingTransaction(
  userId: number,
  params: CreateTransactionParams
  // tslint:disable-next-line:no-any
): ThunkAction<Promise<any>> {
  return async (dispatch: Dispatch) => {
    playCashSound(params);
    const promise = post(`user/${userId}/transaction`, params);
    const data = await errorHandler<TransactionResponse>(dispatch, {
      promise,
      defaultError: 'USER_TRANSACTION_CREATION_ERROR',
    });
    if (data && data.transaction) {
      dispatch(userDetailsLoaded(data.transaction.user));
      dispatch(transactionsLoaded([data.transaction]));
      return data.transaction;
    }
    return undefined;
  };
}

export function startDeletingTransaction(
  userId: number,
  transactionId: number
): DefaultThunkAction {
  return async (dispatch: Dispatch) => {
    const promise = restDelete(`user/${userId}/transaction/${transactionId}`);
    const data = await errorHandler<TransactionResponse>(dispatch, {
      promise,
      defaultError: 'USER_TRANSACTION_DELETION_ERROR',
    });
    if (data && data.transaction) {
      dispatch(userDetailsLoaded(data.transaction.user));
      dispatch(transactionsLoaded([data.transaction]));
    }
  };
}

interface TransactionState {
  [key: number]: Transaction;
}

export function transaction(
  state: TransactionState = {},
  action: Action
): TransactionState {
  switch (action.type) {
    case TransactionTypes.TransactionsLoaded:
      return action.payload.reduce((nextState, transaction) => {
        return { ...nextState, [transaction.id]: transaction };
      }, state);
    default:
      return state;
  }
}

export function getTransactionState(state: AppState): TransactionState {
  return state.transaction;
}

export function getTransaction(
  state: AppState,
  id: number
): Transaction | undefined {
  return getTransactionState(state)[id];
}

export function isTransactionDeletable(state: AppState, id: number): boolean {
  const transaction = getTransaction(state, id);
  if (transaction) {
    return transaction.isDeletable;
  }

  return false;
}

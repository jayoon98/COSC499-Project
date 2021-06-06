export type ResponseCallback<T> = (result?: T, error?: Error) => void;
export type ErrorCallback = (error?: Error) => void;

export type UserAccount = {
  name: string;
  email: string;
};

import { STATUS } from '../constants';

export async function handleErrors(err: any, callback?: Function) {
  if (err.response) {
    const { status } = err.response;

    switch (status) {
      case STATUS.NOT_AUTHORIZED:
        console.info(`Refresh Token: ${STATUS.NOT_AUTHORIZED}`);

        return;
    }
  }

  console.info(err.message);

  if (callback) callback();
}

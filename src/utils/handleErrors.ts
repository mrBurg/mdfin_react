import { STATUS } from '@src/constants';
import { THandleErrors } from './@types';

export async function handleErrors(
  err: any,
  callback?: () => void
): THandleErrors {
  if (err.response) {
    const { status } = err.response;

    switch (status) {
      case STATUS.NOT_AUTHORIZED:
        console.info(
          `Not authorized. Required to update token: ${STATUS.NOT_AUTHORIZED}`
        );

        return { view: 'SIGN_IN' };
      case STATUS.BAD_REQUEST:
        console.info(`Invalid account info: ${STATUS.BAD_REQUEST}`);
        return false;
    }
  }

  console.info(err.message);

  if (callback) callback();
}

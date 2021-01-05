import React, { FC } from 'react';
import Link from 'next/link';

import './Logo.module.scss';
import { WithTracking } from '@components/hocs';
import { URLS } from '@routes';
import { WidgetRoles } from '@src/roles';
import { EMouseEvents } from '@src/trackingConstants';
import { TLogoProps } from './@types';

export const Logo: FC<TLogoProps> = (props) => {
  return (
    <WithTracking id={`Logo-${WidgetRoles.link}`} events={[EMouseEvents.CLICK]}>
      <Link href={URLS.HOME} as={URLS.HOME}>
        <a role={WidgetRoles.link} {...props}>
          <img src="/theme/logo.svg" alt="Logo" />
        </a>
      </Link>
    </WithTracking>
  );
};

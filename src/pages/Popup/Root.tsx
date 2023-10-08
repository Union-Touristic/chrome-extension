import React from 'react';

import Providers from './context/providers';
import ExtensionApp from './ExtensionApp';

export default function MyApp() {
  return (
    <Providers>
      <ExtensionApp />
    </Providers>
  );
}

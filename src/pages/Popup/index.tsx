import React from 'react';
import { createRoot } from 'react-dom/client';

import Providers from './context/providers';
import ExtensionApp from './ExtensionApp';
import './index.css';

const container = document.getElementById('app-container');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
  <Providers>
    <ExtensionApp />
  </Providers>
);

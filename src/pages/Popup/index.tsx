import { createRoot } from 'react-dom/client';
import { ExtensionApp } from './ExtensionApp';
import './index.css';
import { Providers } from '@/ui/compilation-table/providers';
import { Notification } from '@/ui/notification';

const container = document.getElementById('app-container');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

root.render(
  <Providers>
    <ExtensionApp />
    <Notification />
  </Providers>
);

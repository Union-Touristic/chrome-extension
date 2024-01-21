import { createRoot } from 'react-dom/client';
import { ExtensionApp } from './ExtensionApp';
import './index.css';
import { Notification } from '@/ui/notification';
import { store } from '@/redux/store';
import { Provider } from 'react-redux';

const container = document.getElementById('app-container');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

root.render(
  <Provider store={store}>
    <ExtensionApp />
    <Notification />
  </Provider>
);

import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import Button from './Button';

const Login = () => {
  async function handleClick() {
    await chrome.tabs.create({
      url: 'http://localhost:8000/login/',
    });
  }

  return (
    <div className="p-4">
      <div className="rounded-md bg-green-50 p-4 border-2 border-green-100">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircleIcon
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Расширение активно
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>
                Но чтобы воспользоваться ключевыми функциями, необходимо войти в
                CRM-систему
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <Button onClick={handleClick}>Войти</Button>
      </div>
    </div>
  );
};

export default Login;

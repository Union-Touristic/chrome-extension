import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { Button } from '@/ui/compilation-table/elements';

export function Login() {
  async function handleClick(): Promise<void> {
    await chrome.tabs.create({
      url: 'https://uniontouristic.vercel.app/dashboard',
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
}

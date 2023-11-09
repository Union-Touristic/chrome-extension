import { useEffect, useState } from 'react';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(function checkAuthentication() {
    (async function readCookies() {
      const cookies = await chrome.cookies.getAll({
        // TODO: change domain name for production
        domain: 'uniontouristic.vercel.app',
      });

      if (!cookies.length) return null;

      let hasSessionToken = false;
      let hasCsrfToken = false;

      cookies.forEach((cookie) => {
        if (cookie.name.includes('session-token')) {
          hasSessionToken = true;
        }

        if (cookie.name.includes('csrf-token')) {
          hasCsrfToken = true;
        }
      });

      if (hasSessionToken && hasCsrfToken) {
        setIsLoggedIn(true);
      }
    })();
  }, []);

  return { isLoggedIn };
}

export type AuthenticationState = {
  isLoggedIn: boolean;
  csrftoken: string | null;
};

export type AuthenticationAction = {
  type: 'logged in';
  csrftoken: string;
};

const authenticationReducer = (
  state: AuthenticationState,
  action: AuthenticationAction
): AuthenticationState => {
  switch (action.type) {
    case 'logged in':
      return {
        ...state,
        isLoggedIn: true,
        csrftoken: action.csrftoken,
      };
    default:
      throw Error('Unknown action on authenticationReducer');
  }
};

export default authenticationReducer;

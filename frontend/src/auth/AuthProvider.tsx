import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { UserManager, User, WebStorageStateStore } from "oidc-client-ts";

type SigninRedirectArgs = Parameters<UserManager["signinRedirect"]>[0];

const authority = import.meta.env.VITE_OIDC_AUTHORITY as string;

const clientId = import.meta.env.VITE_OIDC_CLIENT_ID as string;

const oidcConfig = {
  authority,
  client_id: clientId,
  redirect_uri: `${window.location.origin}/callback`,
  post_logout_redirect_uri: window.location.origin,
  response_type: "code",
  scope: "openid profile email",

  userStore: new WebStorageStateStore({ store: window.sessionStorage }),

  automaticSilentRenew: true,
  silent_redirect_uri: `${window.location.origin}/silent-callback`,

  monitorSession: true,
};

export const userManager = new UserManager(oidcConfig);

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  accessToken: string | null;
  isAuthenticated: boolean;
  signinRedirect: (args?: SigninRedirectArgs) => Promise<void>;
  signupRedirect: () => Promise<void>;
  signoutRedirect: () => Promise<void>;
  removeUser: () => Promise<void>;
  loadUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const accessToken = user?.access_token ?? null;
  const isAuthenticated = !!user && !user.expired;

  useEffect(() => {
    userManager.getUser().then((user) => {
      setUser(user);
      setIsLoading(false);
    });

    const onUserLoaded = (user: User) => setUser(user);
    const onUserUnloaded = () => setUser(null);

    const onAccessTokenExpiring = () => {
      userManager.signinSilent().catch(() => {});
    };

    const onAccessTokenExpired = () => {
      userManager.getUser().then((u) => setUser(u));
    };

    const onSilentRenewError = () => {
      userManager.getUser().then((u) => setUser(u));
    };

    userManager.events.addUserLoaded(onUserLoaded);
    userManager.events.addUserUnloaded(onUserUnloaded);
    userManager.events.addAccessTokenExpiring(onAccessTokenExpiring);
    userManager.events.addAccessTokenExpired(onAccessTokenExpired);
    userManager.events.addSilentRenewError(onSilentRenewError);

    userManager.startSilentRenew();

    return () => {
      userManager.events.removeUserLoaded(onUserLoaded);
      userManager.events.removeUserUnloaded(onUserUnloaded);
      userManager.events.removeAccessTokenExpiring(onAccessTokenExpiring);
      userManager.events.removeAccessTokenExpired(onAccessTokenExpired);
      userManager.events.removeSilentRenewError(onSilentRenewError);

      userManager.stopSilentRenew();
    };
  }, []);

  const signinRedirect = (args?: SigninRedirectArgs) =>
    userManager.signinRedirect(args);

  const signupRedirect = (args?: SigninRedirectArgs) => {
    return userManager.signinRedirect({
      ...args,
      extraQueryParams: {
        ...args?.extraQueryParams,
        // kc_action: "register",
        prompt: "create", // Standard OIDC dla rejestracji
        // Jeśli używasz Auth0, zamień na: screen_hint: "signup"
        // Jeśli używasz Keycloak, czasem wymagane jest: kc_idp_hint: "rejestracja"
      },
    });
  };

  const signoutRedirect = () => userManager.signoutRedirect();

  const removeUser = () => userManager.removeUser();
  const loadUser = async () => {
    const user = await userManager.getUser();
    setUser(user);
    return user;
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isLoading,
      accessToken,
      isAuthenticated,
      signinRedirect,
      signupRedirect,
      signoutRedirect,
      removeUser,
      loadUser,
    }),
    [user, isLoading, accessToken, isAuthenticated],
  );

  if (isLoading) {
    return <div>Inicjalizacja sesji...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

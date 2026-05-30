import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import InitLoading from '@/components/InitLoading'
import Keycloak, { type KeycloakConfig } from "keycloak-js";
import { useTheme } from '@/hooks/useTheme'

const keycloakConfig: KeycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
};

// Tworzymy instancję singletona poza komponentem
export const keycloak = new Keycloak(keycloakConfig);

interface AuthContextType {
  keycloak: Keycloak;
  isAuthenticated: boolean;
  isLoading: boolean;
  userProfile: any | null;
  login: (redirectUri?: string) => Promise<void>;
  register: (redirectUri?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Ensure theme gets applied globally as soon as AuthProvider mounts
  useTheme()
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    keycloak
      .init({
        onLoad: "check-sso", // Sprawdza sesję bez przekierowania
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
        pkceMethod: "S256",
      })
      .then(async (authenticated) => {
        setIsAuthenticated(authenticated);
        if (authenticated) {
          const profile = await keycloak.loadUserProfile();
          setUserProfile(profile);
        }
      })
      .finally(() => setIsLoading(false));

    // Automatyczne odświeżanie tokena
    keycloak.onTokenExpired = () => {
      keycloak.updateToken(30).catch(() => {
        console.error("Failed to refresh token");
      });
    };
  }, []);

  const login = (redirectUri?: string) => {
    const finalRedirect = redirectUri
      ? redirectUri.startsWith("http")
        ? redirectUri
        : `${window.location.origin}${redirectUri}`
      : window.location.origin;
    return keycloak.login({ redirectUri: finalRedirect });
  };

  const register = (redirectUri?: string) => {
    const finalRedirect = redirectUri
      ? redirectUri.startsWith("http")
        ? redirectUri
        : `${window.location.origin}${redirectUri}`
      : window.location.origin;
    return keycloak.register({ redirectUri: finalRedirect });
  };

  const logout = () => keycloak.logout({ redirectUri: window.location.origin });

  const value = useMemo(
    () => ({
      keycloak,
      isAuthenticated,
      isLoading,
      userProfile,
      login,
      register,
      logout,
    }),
    [isAuthenticated, isLoading, userProfile],
  );

  if (isLoading) return <InitLoading />;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

import { useEffect, useState } from "react";
import { LocaleProvider } from "./context/LocaleContext";
import { PlatformProvider, usePlatform } from "./context/PlatformContext";
import { useSettingsStore } from "./store/useSettingsStore";
import { useSnippetStore } from "./store/useSnippetStore";
import { useFolderStore } from "./store/useFolderStore";
import { MainLayout } from "./layouts/MainLayout";
import { ToastContainer } from "./components/ui/ToastContainer";
import { LoadingSpinner } from "./components/ui/Loading";
import "./styles/index.css";

function App() {
  const initSettings = useSettingsStore(state => state.initSettings);
  const isSettingsReady = useSettingsStore(state => state.isInitialized);
  const initSnippets = useSnippetStore(state => state.initSnippets);
  const isSnippetsReady = useSnippetStore(state => state.isInitialized);
  const initFolders = useFolderStore(state => state.initFolders);
  const isFoldersReady = useFolderStore(state => state.isInitialized);
  const { platform } = usePlatform();
  const theme = useSettingsStore(state => state.theme);
  
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const runInit = async () => {
      try {
        await Promise.all([initSettings(), initSnippets(), initFolders()]);
      } catch (err) {
        setInitError(err instanceof Error ? err.message : String(err));
      }
    };
    runInit();
  }, [initSettings, initSnippets]);

  useEffect(() => {
    document.body.className = `${theme} ${platform}`;
  }, [theme, platform]);

  if (initError) {
    return (
      <div style={{ 
        display: 'flex', 
        height: '100vh', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px',
        background: '#1a1a1a',
        color: '#ff4444',
        fontFamily: 'sans-serif'
      }}>
        <h2>Startup Error</h2>
        <pre style={{ background: '#2a2a2a', padding: '15px', borderRadius: '8px' }}>{initError}</pre>
      </div>
    );
  }

  if (!isSettingsReady || !isSnippetsReady || !isFoldersReady) {
    return <LoadingSpinner fullScreen size={40} />;
  }

  return (
    <>
      <MainLayout />
      <ToastContainer />
    </>
  );
}

function AppWithProviders() {
  const locale = useSettingsStore(state => state.locale);
  const setLocale = useSettingsStore(state => state.setLocale);

  return (
    <PlatformProvider>
      <LocaleProvider initialLocale={locale} onLocaleChange={setLocale}>
        <App />
      </LocaleProvider>
    </PlatformProvider>
  );
}

export default AppWithProviders;

import { AppContextProvider, AnnotationsContextProvider } from "./context";
import { Dashboard } from "./screens/Dashboard";

export default function App() {
  return (
    <AppContextProvider>
      <AnnotationsContextProvider>
        <Dashboard />
      </AnnotationsContextProvider>
    </AppContextProvider>
  );
}

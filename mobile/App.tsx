/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import Toast from "react-native-toast-message";
import { AppStateProvider } from "./src/contexts/AppState";
import AppRoutes from "./src/routes/AppRoutes";
import { RefreshProvider } from "./src/contexts/refreshContext";

function App(): React.JSX.Element {
  return (
    <AppStateProvider>
      <RefreshProvider>
        <AppRoutes/>
        <Toast autoHide={true} visibilityTime={2000} />
      </RefreshProvider>
    </AppStateProvider>
  );
}

export default App;

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { AppStateProvider } from "./src/contexts/AppState";
import AppRoutes from "./src/routes/AppRoutes";

function App(): React.JSX.Element {
  return (
    <AppStateProvider>
      <AppRoutes/>
    </AppStateProvider>
  );
}

export default App;

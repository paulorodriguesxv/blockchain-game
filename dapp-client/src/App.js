import './App.css';
import { Provider } from "react-redux";

import store from "./store";
import { BlockchainProvider } from './blockchain';
import GameContainer from './componentes/GameContainer';

function App() {
  
  return (
    <Provider store={store}>
      <BlockchainProvider>     
        <div className="App">
          <GameContainer></GameContainer>
        </div>
      </BlockchainProvider>     
    </Provider>      
  );
}

export default App
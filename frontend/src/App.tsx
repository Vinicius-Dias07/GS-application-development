import { useAuth } from "./context/auth-context";
import Login from "./pages/Login";
import Painel from "./pages/Painel";

function App() {
  const { usuario } = useAuth();

  // Sem biblioteca de rotas: quem decide a tela é o estado "usuario"
  return usuario ? <Painel /> : <Login />;
}

export default App;

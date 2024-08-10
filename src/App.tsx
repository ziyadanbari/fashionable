import Canvas from "./canvas";
import Customizer from "./pages/customizer";
import Home from "./pages/home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  return (
    <main className="app transition-none ease-in">
      <div className="cursor-default">
        <Home />
      </div>
      <Canvas />
      <div className="cursor-default">
        <Customizer />
      </div>
      <ToastContainer />
    </main>
  );
};

export default App;

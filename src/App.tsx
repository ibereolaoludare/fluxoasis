import { Route, Switch } from "wouter";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
    return (
        <Switch>
            <Route component={Home} path={"/"} />
            <Route component={Home} path={"/home"} />
            <Route component={Shop} path={"/shop"} />
            <Route component={About} path={"/about"} />
            <Route component={Contact} path={"/contact"} />
            <Route component={NotFound} />
        </Switch>
    );
}

export default App;

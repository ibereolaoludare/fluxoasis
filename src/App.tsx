import { Route, Switch } from "wouter";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";

function App() {
    return (
        <Switch>
            <Route component={Home} path={"/"} />
            <Route component={Home} path={"/home"} />
            <Route component={NotFound} />
        </Switch>
    );
}

export default App;

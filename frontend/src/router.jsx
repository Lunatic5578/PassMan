import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import SignUp from "./component/Signup";
import Signin from "./component/Signin";
import Manager from "./routes/Manager";
import PrivateRoute from "./component/PrivateRoute";
import Dashboard from "./component/Dashboard";

export const router=createBrowserRouter([
    {path:"/",element:<App/>},
    {path:"/signup",element:<SignUp/>},
    {path:"/signin",element:<Signin/>},
    {path:"/dashboard",element:<PrivateRoute><Manager/></PrivateRoute>}
])

//4cc13628-4afa-4776-8dea-ca98f323248b
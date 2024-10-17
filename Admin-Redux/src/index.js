import React from "react";
import ReactDOM from 'react-dom/client';
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import "./i18n";
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import { Provider } from "react-redux";
import store from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <React.Fragment>
        <App />
        <ToastContainer />
      </React.Fragment>
    </BrowserRouter>
  </Provider>
);

serviceWorker.unregister();

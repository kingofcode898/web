// App.jsx
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { UserProvider } from './userContext';
import { router } from './Routes';

const App = () => {
  const history = createBrowserHistory();

  return (
    <UserProvider>
      <RouterProvider router={router} history={history}></RouterProvider>
    </UserProvider>
  );
};

export default App;

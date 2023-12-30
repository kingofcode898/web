// App.jsx
import React, { useState } from 'react';
import { RouterProvider} from 'react-router-dom';
import { UserContext } from './userContext';
import { router } from './Routes';

const App = () => {
    const [CurrentUser, setCurrentUser] = useState({})
  return (
    <UserContext.Provider value={[CurrentUser, setCurrentUser]}>
      <RouterProvider router={router} ></RouterProvider>
    </UserContext.Provider>
  );
};

export default App;

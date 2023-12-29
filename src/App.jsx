// App.jsx
import React, { useState } from 'react';
import { RouterProvider} from 'react-router-dom';
import { UserContext } from './userContext';
import { router } from './Routes';

const App = () => {
    const [UserID, setUserID] = useState('')
  return (
    <UserContext.Provider value={[UserID, setUserID]}>
      <RouterProvider router={router} ></RouterProvider>
    </UserContext.Provider>
  );
};

export default App;

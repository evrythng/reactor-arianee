import React, {useEffect} from 'react';
import Loader from "./components/Loader";
import Box from "@material-ui/core/Box";
import {onApplicationLoad} from "./services/evrythngQueries";

/**
 * Get a query param.
 *
 * @param {string} name - Param name to find.
 * @returns {string} Param value if found.
 */
export const getQueryParam = name => new URLSearchParams(window.location.search).get(name);

const App = () => {

  useEffect(() => {
    const thngId = getQueryParam('thng');
    const code = getQueryParam('code');
    if (thngId && code) {
      onApplicationLoad(thngId, code);
    } else {
      console.error('You need to provide a THNG and a code');
    }
  }, []);

  return (
    <Box
      className="App"
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      style={{position: 'absolute', 'top': '0', bottom: '0', right: '0', 'left': '0'}}
    >
      <Box>
        <Loader/>
        <Box
          mt={4}
          fontSize={16}
          color="#000000"
        >
          Creating the certificate...
        </Box>
      </Box>
    </Box>
  );
}

export default App;

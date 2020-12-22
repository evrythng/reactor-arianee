import React from 'react';
import { CircularProgress } from '@material-ui/core';
import Box from "@material-ui/core/Box";

/**
 * Centered, space-filling Loader component.
 *
 * @returns {JSX.Element} Loader component.
 */
const Loader = () => {
  const style = {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    margin: 'auto',
    color: '#237A85'
  };

  return (
    <Box display="flex" style={style} mt={2} mb={2}>
      <CircularProgress color="inherit" />
    </Box>
  );
};

export default Loader;

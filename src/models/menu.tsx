import { useState, useCallback } from 'react';

export default () => {
  const [expanded, setExpanded] = useState(false);

  const setExpandedState = useCallback((expandState: boolean) => {
    setExpanded(expandState);
  }, []);

  return {
    expanded,
    setExpandedState,
  };
};

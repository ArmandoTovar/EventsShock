import { useState } from 'react';

const useInput = (type, initial = '') => {
  const [value, setValue] = useState(initial);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  return {
    value,
    onChange,
    type,
  };
};

export default useInput;

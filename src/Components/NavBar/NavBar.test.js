import React from 'react';
import { render } from '@testing-library/react';

import NavBar from './NavBar';

it('renders without crashing', () => {
  render(<NavBar />);
});

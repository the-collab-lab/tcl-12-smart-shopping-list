import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import NavBar from './NavBar';

it('renders without crashing', () => {
  render(
    <MemoryRouter>
      <NavBar />
    </MemoryRouter>,
  );
});

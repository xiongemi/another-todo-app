import React from 'react';
import { render } from '@testing-library/react';
import Page from '../src/app/page';

// Mock Next.js redirect to avoid NEXT_REDIRECT throw during render
jest.mock('next/navigation', () => {
  const actual = jest.requireActual('next/navigation');
  return {
    ...actual,
    redirect: jest.fn(),
  };
});

describe('Page', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Page />);
    expect(baseElement).toBeTruthy();
  });
});

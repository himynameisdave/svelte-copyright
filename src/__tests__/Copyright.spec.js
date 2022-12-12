import { render } from '@testing-library/svelte';
import Copyright from './Copyright.spec.svelte';

const FIXED_DATE = new Date('2022-05-29');
const FIXED_YEAR = FIXED_DATE.getFullYear();

// Get around some of the stupidity of this testing library
function renderCopyright(props = {}) {
  const { container } = render(Copyright, {
    date: FIXED_DATE,
    ...props,
  });
  return container.firstChild.firstChild;
}

describe('<Copyright />', () => {
  it('uses the provided date for the year', () => {
    const container = renderCopyright({ date: new Date(1990, 0, 1) });
    expect(container).toHaveTextContent('© Copyright 1990 Dave Lunny');
  });

  it('formats the year for format="numeric"', () => {
    const container = renderCopyright({ format: 'numeric' });
    expect(container).toHaveTextContent(`© Copyright ${FIXED_YEAR} Dave Lunny`);
  });

  it('formats the year for format="2-digit"', () => {
    const container = renderCopyright({ format: '2-digit' });
    expect(container).toHaveTextContent(`© Copyright ’${FIXED_YEAR.toString().slice(2)} Dave Lunny`);
  });

  it('positions the copyright for position="pre"', () => {
    const container = renderCopyright({ position: 'pre' });
    expect(container).toHaveTextContent(`© Copyright ${FIXED_YEAR} Dave Lunny`);
  });

  it('positions the copyright for position="post"', () => {
    const container = renderCopyright({ position: 'post' });
    expect(container).toHaveTextContent(`Dave Lunny © Copyright ${FIXED_YEAR}`);
  });

  it('displays a date range when showRange=true', () => {
    const container = renderCopyright({
      date: new Date(1990, 0, 1),
      showRange: true,
    });
    expect(container).toHaveTextContent(`© Copyright 1990 - ${FIXED_YEAR} Dave Lunny`);
  });

  it('showRange=true but no date is provided, just display current year', () => {
    const container = renderCopyright({ showRange: true });
    expect(container).toHaveTextContent(`© Copyright ${FIXED_YEAR} Dave Lunny`);
  });

  it('spreads the rest of the props correctly', () => {
    const mockCustomClass = 'custom-class';
    const container = renderCopyright({ class: mockCustomClass });
    expect(container.classList.contains('custom-class')).toBe(true);
  });

});

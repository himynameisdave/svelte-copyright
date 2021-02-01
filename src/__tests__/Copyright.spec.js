import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/svelte';
import Copyright from './Copyright.spec.svelte';


// Get around some of the stupidity of this testing library
function renderCopyright(props = {}) {
  //  Fixed date so that tests don't fail next year.
  const fixedDate = new Date('2021-05-29');
  const { container } = render(Copyright, {
    date: fixedDate,
    ...props,
  });
  return container.firstChild.firstChild;
}

describe('<Copyright />', () => {

  test('it uses the provided date for the year', () => {
    const container = renderCopyright({ date: new Date(1990, 0, 1) });
    expect(container).toHaveTextContent('© Copyright 1990 Dave Lunny');
  });

  test('it formats the year for format="numeric"', () => {
    const container = renderCopyright({ format: 'numeric' });
    expect(container).toHaveTextContent('© Copyright 2021 Dave Lunny');
  });

  test('it formats the year for format="2-digit"', () => {
    const container = renderCopyright({ format: '2-digit' });
    expect(container).toHaveTextContent('© Copyright ’21 Dave Lunny');
  });

  test('it positions the copyright for position="pre"', () => {
    const container = renderCopyright({ position: 'pre' });
    expect(container).toHaveTextContent('© Copyright 2021 Dave Lunny');
  });

  test('it positions the copyright for position="post"', () => {
    const container = renderCopyright({ position: 'post' });
    expect(container).toHaveTextContent('Dave Lunny © Copyright 2021');
  });

  test('it displays a date range when showRange=true', () => {
    const container = renderCopyright({
      date: new Date(1990, 0, 1),
      showRange: true,
    });
    expect(container).toHaveTextContent('© Copyright 1990 - 2021 Dave Lunny');
  });

  test('if showRange=true but no date is provided, just display current year', () => {
    const container = renderCopyright({ showRange: true });
    expect(container).toHaveTextContent('© Copyright 2021 Dave Lunny');
  });

  test('it spreads the rest of the props correctly', () => {
    const mockCustomClass = 'custom-class';
    const container = renderCopyright({ class: mockCustomClass });
    expect(container.classList.contains('custom-class')).toBe(true);
  });

});

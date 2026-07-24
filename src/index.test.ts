import {
  afterEach, beforeEach, describe, expect, test, vi,
} from 'vitest';
import { render } from '@testing-library/svelte';
import Copyright from './Copyright.wrapper.svelte';
import type { CopyrightProps } from '$lib/Copyright.svelte';

function renderCopyright(props: Partial<CopyrightProps> = {}): HTMLSpanElement {
  const { container } = render(Copyright, { props });
  return container.querySelector('span') as HTMLSpanElement;
}

describe('<Copyright />', () => {
  //  Pin "now" so these tests don't rot as the years roll over.
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2021-05-29'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('it uses the provided date for the year', () => {
    const element = renderCopyright({ date: new Date(1990, 0, 1) });
    expect(element).toHaveTextContent('© Copyright 1990 Dave Lunny');
  });

  test('it defaults to the current year', () => {
    const element = renderCopyright();
    expect(element).toHaveTextContent('© Copyright 2021 Dave Lunny');
  });

  test('it formats the year for format="numeric"', () => {
    const element = renderCopyright({ format: 'numeric' });
    expect(element).toHaveTextContent('© Copyright 2021 Dave Lunny');
  });

  test('it formats the year for format="2-digit"', () => {
    const element = renderCopyright({ format: '2-digit' });
    expect(element).toHaveTextContent('© Copyright ’21 Dave Lunny');
  });

  test('it positions the copyright for position="pre"', () => {
    const element = renderCopyright({ position: 'pre' });
    expect(element).toHaveTextContent('© Copyright 2021 Dave Lunny');
  });

  test('it positions the copyright for position="post"', () => {
    const element = renderCopyright({ position: 'post' });
    expect(element).toHaveTextContent('Dave Lunny © Copyright 2021');
  });

  test('it displays a date range when showRange=true', () => {
    const element = renderCopyright({
      date: new Date(1990, 0, 1),
      showRange: true,
    });
    expect(element).toHaveTextContent('© Copyright 1990 - 2021 Dave Lunny');
  });

  test('if showRange=true but no date is provided, just display current year', () => {
    const element = renderCopyright({ showRange: true });
    expect(element).toHaveTextContent('© Copyright 2021 Dave Lunny');
  });

  test('it spreads the rest of the props onto the span', () => {
    const element = renderCopyright({ 'class': 'custom-class' });
    expect(element.classList.contains('custom-class')).toBe(true);
  });
});

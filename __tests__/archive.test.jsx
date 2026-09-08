import { render, screen, fireEvent, within } from '@testing-library/react';
import Archive from '@/app/_components/Archive';
import { getVideoId } from '@/app/_components/VideoModal';

const playlists = Array.from({ length: 7 }, (_, index) => ({
  date: `26-09-0${7 - index}`,
  video: [{ title: `아리 플레이 ${index}`, link: 'https://youtu.be/DALdlCGyJjg' },
    { title: index === 0 ? '펜타킬 순간들' : '쿼드라킬 모음', link: 'https://www.youtube.com/watch?v=q7bmQp4J6cA' }],
}));

beforeEach(() => { localStorage.clear(); window.scrollTo = jest.fn(); });

test('filters individual videos and resets pagination when searching', () => {
  render(<Archive playlists={playlists} />);
  fireEvent.click(screen.getByRole('button', { name: '다음 페이지' }));
  expect(screen.getByRole('button', { name: '아리 플레이 5' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '영상 검색' }));
  fireEvent.change(screen.getByRole('textbox'), { target: { value: '펜타' } });
  expect(screen.getByRole('button', { name: '펜타킬 순간들' })).toHaveClass('penta');
  expect(screen.queryByRole('button', { name: '아리 플레이 0' })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: '1', exact: true })).toHaveAttribute('aria-current', 'page');
});

test('opens the selected video in an accessible modal and closes with Escape', () => {
  render(<Archive playlists={playlists} />);
  fireEvent.click(screen.getByRole('button', { name: '펜타킬 순간들' }));
  expect(screen.getByRole('dialog')).toHaveTextContent('펜타킬 순간들');
  expect(within(screen.getByRole('dialog')).getByTitle('펜타킬 순간들')).toHaveAttribute('src', expect.stringContaining('q7bmQp4J6cA'));
  fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('validates supported YouTube formats and rejects other hosts', () => {
  expect(getVideoId('https://youtu.be/DALdlCGyJjg?t=2')).toBe('DALdlCGyJjg');
  expect(getVideoId('https://www.youtube.com/shorts/DALdlCGyJjg')).toBe('DALdlCGyJjg');
  expect(getVideoId('https://example.com/watch?v=DALdlCGyJjg')).toBeNull();
  expect(getVideoId('invalid')).toBeNull();
});

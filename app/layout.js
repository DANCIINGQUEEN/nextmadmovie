import './globals.css';
export const metadata = {
  title: 'lolmadmovie — 다시 보고 싶은 순간들',
  description: '우리의 협곡, 잊지 못할 플레이. 리그 오브 레전드 하이라이트 아카이브.'
};
export default function RootLayout({
  children
}) {
  return <html lang="ko"><body>{children}</body></html>;
}

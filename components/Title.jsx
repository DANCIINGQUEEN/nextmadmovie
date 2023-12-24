import Link from "next/link";
export default function Title({ date }) {
  return (
    <div>
      <p>{date}</p>
      <Link href="">전체보기</Link>
    </div>
  );
}

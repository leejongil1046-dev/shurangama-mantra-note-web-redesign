import Link from "next/link";

type MoreLayoutProps = {
  children: React.ReactNode;
};

export default function MoreLayout({ children }: MoreLayoutProps) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-254px)] w-[1000px]">
      {/* 좌측 사이드 네비게이션 */}
      <aside className="flex flex-col items-center justify-start w-[300px] border-r border-gray-200">
        <nav className="text-xl w-full text-center">
          <Link
            href="/more/video"
            className="block rounded py-6 text-gray-500 border-b border-gray-200 hover:bg-gray-50"
          >
            개발자 이야기
          </Link>
          <Link
            href="/more/video"
            className="block rounded py-6 text-gray-900 font-medium border-b border-gray-200 hover:bg-gray-50"
          >
            능엄주 독송 영상
          </Link>
          <Link
            href="/more/video"
            className="block rounded py-6 text-gray-500 border-b border-gray-200 hover:bg-gray-50"
          >
            회원 정보
          </Link>
          <Link
            href="/more/video"
            className="block rounded py-6 text-gray-500 border-b border-gray-200 hover:bg-gray-50"
          >
            기록보기
          </Link>
          <Link
            href="/more/video"
            className="block rounded py-6 text-gray-500 border-b border-gray-200 hover:bg-gray-50"
          >
            개인정보처리방침
          </Link>
          <Link
            href="/more/video"
            className="block rounded py-6 text-gray-500 border-b border-gray-200 hover:bg-gray-50"
          >
            이용약관
          </Link>
          <Link
            href="/more/video"
            className="block rounded py-6 text-gray-500 border-b border-gray-200 hover:bg-gray-50"
          >
            후원하기
          </Link>
        </nav>
      </aside>

      {/* 우측 컨텐츠 영역 */}
      <section className="flex flex-1 overflow-auto">{children}</section>
    </div>
  );
}

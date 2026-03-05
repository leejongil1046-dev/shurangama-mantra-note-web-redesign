"use client";

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-[1000px] flex-col px-6 py-10">
      {/* 가운데 캐치프레이즈 섹션 */}
      <section className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <p className="text-sm tracking-[0.3em] text-gray-500">
          DAEBULJEONG-SU NUNGEOM SINJU
        </p>

        <h1 className="font-mantra text-4xl font-semibold">
          능엄주를 천천히, 끝까지
        </h1>

        <p className="max-w-[570px] text-base leading-relaxed text-gray-600">
          능엄주는 동아시아 불교에서 오랫동안 독송되어 온 긴 다라니입니다. 한 번
          입에 익으면 평생을 함께하지만, 분량이 길고 흐름이 복잡해 처음부터
          끝까지 혼자 외우기란 쉽지 않습니다.
        </p>

        <div className="mt-2 flex flex-col items-center gap-1 text-sm text-gray-500">
          <p>페이지별 읽기 · 빈칸 연습 · 단계적 암기</p>
          <p>조금씩, 그러나 꾸준히 익힐 수 있도록 돕는 학습형 웹입니다.</p>
        </div>
      </section>

      {/* 하단 정보/소개 섹션 */}
      <section className="mt-10 space-y-10 pb-10 text-base leading-relaxed text-gray-700">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">능엄주는 어떤 다라니일까?</h2>
          <p>
            능엄주는 동아시아 불교에서 널리 독송되는 긴 다라니로, 전통적으로
            『능엄경』의 맥락과 함께 전해져 왔습니다. 여러 사찰의 아침 예불과
            일상 수행 속에서 보호와 정화의 의미로 독송되어 온 텍스트이기도
            합니다.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">
            왜 따로 연습 도구가 필요할까?
          </h2>
          <p>
            능엄주는 분량이 길고 반복 구조가 많아, 처음에는 어디까지 외웠는지
            스스로 점검하기가 어렵습니다. 종이책이나 PDF만으로는 &quot;어느
            구간을, 몇 번이나 틀렸는지&quot; 감을 잡기 힘들고, 다시 처음부터
            반복하게 되는 경우가 많습니다.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">이 사이트에서 할 수 있는 것</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>능엄주를 페이지별로 나누어 필요한 구간만 집중해서 읽기</li>
            <li>앞뒤 페이지를 오가며 전체 흐름 속에서 반복 연습하기</li>
            <li>
              <strong>연습하기</strong>
              <ul className="list-disc space-y-0.5 pl-5 mt-1">
                <li>
                  난이도에 따라 빈칸을 만들고, 마우스로 올리면 정답을 보며
                  반복해서 익히기
                </li>
              </ul>
            </li>
            <li>
              <strong>암기하기</strong>
              <ul className="list-disc space-y-0.5 pl-5 mt-1">
                <li>같은 난이도로 빈칸을 만들고 직접 입력한 뒤 채점하기</li>
                <li>
                  페이지별·전체 정답률 확인, 맞은 글자는 파란색·틀린 글자는
                  빨간색으로 다시 보기
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">이 웹의 목표</h2>
          <p>
            이 웹은 능엄주를 처음 접하는 사람도 전체 흐름을 따라 읽고, 빈칸
            연습과 암기를 통해 단계적으로 익힐 수 있도록 돕는 학습형 도구입니다.
            전통적으로 이어져 온 독송을 대신하려는 것이 아니라, 각자의 자리에서
            차분히 익혀 갈 수 있는 작은 보조 수단이 되는 것을 목표로 합니다.
          </p>
        </div>
      </section>
    </div>
  );
}

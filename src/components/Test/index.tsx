import * as Scrollytelling from "@bsmnt/scrollytelling";
import { DemoView } from "../DemoView";
import { ScenarioContextProvider } from "@/contexts/scenario";
import { ScenarioSelector } from "../ControlHeader/ScenarioSelector";

export function ScrollyTelling() {
    return (
        <div className="flex flex-col items-center justify-center">
            <Scrollytelling.Root scrub={true} start="top center" end="bottom center">
                <div className="container space-y-8 mx-auto px-4">
                    {/* 첫 번째 애니메이션 섹션 */}
                    <Scrollytelling.Animation
                        tween={{ start: 0, end: 25, from: { opacity: 0, y: 50 } }}
                    >
                        <div className="text-center py-16">
                            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                BSMNT Scrollytelling
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300">
                                스크롤 기반 애니메이션 라이브러리
                            </p>
                        </div>
                    </Scrollytelling.Animation>

                    {/* 두 번째 애니메이션 섹션 */}
                    <Scrollytelling.Animation
                        tween={{
                            start: 25,
                            end: 50,
                            from: { opacity: 0, scale: 0.9 }
                        }}
                    >
                        <div className="rounded-2xl shadow-xl">
                            <ScenarioContextProvider>
                                <ScenarioSelector/>
                                <DemoView />
                            </ScenarioContextProvider>
                        </div>
                    </Scrollytelling.Animation>

                    {/* 세 번째 애니메이션 섹션 */}
                    <Scrollytelling.Animation
                        tween={{ start: 50, end: 75, from: { opacity: 0, x: -100 } }}
                    >
                        <div className="grid md:grid-cols-3 gap-8 py-16">
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
                                <div className="text-4xl mb-4">🚀</div>
                                <h3 className="text-xl font-bold mb-2">빠른 설정</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    간단한 props로 복잡한 애니메이션 구현
                                </p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
                                <div className="text-4xl mb-4">⚡</div>
                                <h3 className="text-xl font-bold mb-2">고성능</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    GSAP의 강력한 성능으로 부드러운 애니메이션
                                </p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
                                <div className="text-4xl mb-4">🎯</div>
                                <h3 className="text-xl font-bold mb-2">정밀 제어</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    시작과 끝 지점을 정확하게 제어
                                </p>
                            </div>
                        </div>
                    </Scrollytelling.Animation>

                    {/* 마지막 애니메이션 섹션 */}
                    <Scrollytelling.Animation
                        tween={{ start: 90, end: 100, from: { opacity: 0, y: 30 } }}
                    >
                        <div className="text-center py-20">
                            <h2 className="text-4xl font-bold mb-4">시작해보세요!</h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                                스크롤을 움직여 애니메이션을 확인해보세요
                            </p>
                            <div className="inline-block bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg">
                                ✨ BSMNT Scrollytelling
                            </div>
                        </div>
                    </Scrollytelling.Animation>
                </div>
            </Scrollytelling.Root>

            {/* 추가 스크롤 공간 */}
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4">스크롤을 계속해서 위로 올라가보세요</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        애니메이션이 반복됩니다
                    </p>
                </div>
            </div>
        </div>
    );
}
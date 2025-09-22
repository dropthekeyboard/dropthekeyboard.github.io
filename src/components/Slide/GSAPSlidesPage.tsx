// no default React import needed with React 17+ JSX transform
import {
  SlideGSAPSection,
  Slide001, Slide002, Slide003, Slide004, Slide005, Slide006, Slide007,
  Slide008, Slide009, Slide010, Slide011, Slide012, Slide013, Slide014,
  Slide015, Slide016, Slide017
} from ".";

export default function GSAPSlidesPage() {
  return (
    <div>
      {/* All Slides with different animations */}
      <SlideGSAPSection className="min-h-screen bg-neutral-900" variant="scaleIn" ease="back.out(1.7)">
        <div data-anim className="relative w-full h-full">
          <Slide001 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection pin pinDistance={1600} scrub={1} className="min-h-screen bg-neutral-950" variant="slideLeft">
        <div data-anim>
          <Slide002 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection pin pinDistance={1000} className="min-h-screen bg-black flex items-center justify-center" variant="rotateIn">
        <div data-anim>
          <Slide003 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen bg-neutral-800 flex items-center justify-center" variant="fadeUp">
        <div data-anim>
          <Slide004 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen bg-neutral-900 flex items-center justify-center" variant="scaleIn">
        <div data-anim>
          <Slide005 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen bg-neutral-950 flex items-center justify-center" variant="slideRight">
        <div data-anim>
          <Slide006 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen bg-black flex items-center justify-center" variant="bounceIn">
        <div data-anim>
          <Slide007 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen bg-neutral-800 flex items-center justify-center" variant="fadeUp">
        <div data-anim>
          <Slide008 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen bg-neutral-900 flex items-center justify-center" variant="slideLeft">
        <div data-anim>
          <Slide009 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen bg-neutral-950 flex items-center justify-center" variant="scaleIn" ease="back.out(1.7)">
        <div data-anim>
          <Slide010 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen bg-black flex items-center justify-center" variant="rotateIn">
        <div data-anim>
          <Slide011 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen bg-neutral-800 flex items-center justify-center" variant="slideRight">
        <div data-anim>
          <Slide012 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen bg-neutral-900 flex items-center justify-center" variant="bounceIn">
        <div data-anim>
          <Slide013 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen bg-neutral-950 flex items-center justify-center" variant="fadeUp">
        <div data-anim>
          <Slide014 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen bg-black flex items-center justify-center" variant="scaleIn">
        <div data-anim>
          <Slide015 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen bg-neutral-800 flex items-center justify-center" variant="slideLeft">
        <div data-anim>
          <Slide016 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen bg-neutral-900 flex items-center justify-center" variant="rotateIn">
        <div data-anim>
          <Slide017 />
        </div>
      </SlideGSAPSection>

      {/* Pinned narrative section */}
      <SlideGSAPSection className="min-h-screen bg-purple-700/70 flex items-center justify-center" variant="none" pin pinDistance={1600} scrub={1}>
        <div className="text-center text-white space-y-4" data-anim>
          <h2 className="text-4xl font-bold">Pinned Story</h2>
          <p className="opacity-90">이 구간은 스크롤 동안 고정됩니다</p>
        </div>
      </SlideGSAPSection>
    </div>
  );
}

// no default React import needed with React 17+ JSX transform
import {
  ImageSlide,
  SlideGSAPSection,
  Slide001, Slide002, Slide003, Slide004, Slide005, Slide006, Slide007,
  Slide008, Slide009, Slide010, Slide011, Slide012, Slide013, Slide014,
  Slide015, Slide016, Slide017
} from ".";

export default function GSAPSlidesPage() {
  return (
    <div>
      {/* All Slides with different animations */}
      <SlideGSAPSection className="min-h-screen " variant="scaleIn" ease="back.out(1.7)">
        <div data-anim className="relative w-full h-full">
          <Slide001 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection pin pinDistance={1600} scrub={1} className="min-h-screen" variant="slideLeft">
        <div data-anim>
          <Slide002 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection pin pinDistance={1000} scrub={1} className="min-h-screen flex items-center justify-center" variant="rotateIn">
        <div data-anim>
          <Slide003 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen flex items-center justify-center" variant="fadeUp">
        <div data-anim>
          <Slide004 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen flex items-center justify-center" variant="scaleIn">
        <div data-anim>
          <Slide005 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen flex items-center justify-center" variant="slideRight">
        <div data-anim>
          <Slide006 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screenflex items-center justify-center" variant="bounceIn">
        <div data-anim>
          <Slide007 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen flex items-center justify-center" variant="fadeUp">
        <div data-anim>
          <Slide008 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen flex items-center justify-center" variant="slideLeft">
        <div data-anim>
          <Slide009 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen flex items-center justify-center" variant="scaleIn" ease="back.out(1.7)">
        <div data-anim>
          <Slide010 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen flex items-center justify-center" variant="rotateIn">
        <div data-anim>
          <Slide011 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen flex items-center justify-center" variant="slideRight">
        <div data-anim>
          <Slide012 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen flex items-center justify-center" variant="bounceIn">
        <div data-anim>
          <Slide013 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen flex items-center justify-center" variant="fadeUp">
        <div data-anim>
          <Slide014 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen flex items-center justify-center" variant="scaleIn">
        <div data-anim>
          <Slide015 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen flex items-center justify-center" variant="slideLeft">
        <div data-anim>
          <Slide016 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen  flex items-center justify-center" variant="rotateIn">
        <div data-anim>
          <Slide017 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen flex items-center justify-center" variant="scaleIn">
        <div data-anim>
          <ImageSlide imageUrl="/assets/slide/seniors.png" />
        </div>
      </SlideGSAPSection>

      {/* Pinned narrative section */}
      <SlideGSAPSection className="min-h-screen bg-purple-700/70 flex items-center justify-center" variant="none" pin pinDistance={1600} scrub={1}>
      </SlideGSAPSection>
    </div>
  );
}

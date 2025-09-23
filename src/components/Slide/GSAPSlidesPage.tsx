// no default React import needed with React 17+ JSX transform
import {
  ImageSlide,
  SlideGSAPSection,
  Slide001, Slide002, Slide003, Slide004, Slide005, Slide007,
  Slide008, Slide009, Slide011, Slide012, Slide013, Slide017
} from ".";
import { ScenarioSection } from "@/components/Test/ScenarioSection";

export default function GSAPSlidesPage() {
  return (
    <div>
      {/* All Slides with different animations */}
      <SlideGSAPSection className="min-h-screen " variant="scaleIn" ease="back.out(1.7)">
        <div data-anim className="relative w-full h-full">
          <Slide001 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection pin pinDistance={1400} scrub={1} className="min-h-screen" variant="slideLeft">
        <div data-anim className="relative w-full h-full">
          <Slide002 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection pin pinDistance={1600} scrub={1} className="min-h-screen flex items-center justify-center" variant="rotateIn">
        <div data-anim>
          <Slide003 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection pin pinDistance={1600} scrub={2} className="min-h-screen flex items-center justify-center" variant="fadeUp">
        <div data-anim>
          <Slide004 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection pin pinDistance={1600} scrub={2} className="min-h-screen flex items-center justify-center" variant="scaleIn">
        <div data-anim>
          <Slide005 />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection pin pinDistance={1400} scrub={1} className="min-h-screen flex items-center justify-center" variant="slideRight">
        <div data-anim>
          <ImageSlide imageUrl="/assets/slide/slide6_image.png" />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection pin pinDistance={1400} scrub={1} className="min-h-screenflex items-center justify-center" variant="bounceIn">
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
          <ImageSlide imageUrl="/assets/slide/slide10_image.png" />
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

      <SlideGSAPSection pin pinDistance={1000} scrub={1} className="min-h-screen flex items-center justify-center" variant="scaleIn">
        <div data-anim>
          <ImageSlide imageUrl="/assets/slide/slide14_image.png" />
        </div>
      </SlideGSAPSection>

      <SlideGSAPSection className="min-h-screen flex items-center justify-center" variant="scaleIn">
        <div data-anim>
          <ScenarioSection
            sectionIndex={14}
            scenarioId="use_case_1_restaurant_reservation"
            title="식당 예약 시나리오"
            agentStyle="reasoning"
          />
        </div>
      </SlideGSAPSection>
      <SlideGSAPSection className="min-h-screen flex items-center justify-center" variant="scaleIn">
        <div data-anim>
          <ScenarioSection
            sectionIndex={15}
            scenarioId="use_case_2_senior_life_mate"
            title="시니어 라이프 메이트 (Use Case 2)"
            agentStyle="reasoning"
          />
        </div>
      </SlideGSAPSection>
      <SlideGSAPSection pin pinDistance={1000} scrub={1} className="min-h-screen flex items-center justify-center" variant="scaleIn">
        <div data-anim>
          <ImageSlide imageUrl="/assets/slide/slide16_image.png" />
        </div>
      </SlideGSAPSection>
      <SlideGSAPSection className="min-h-screen  flex items-center justify-center" variant="rotateIn">
        <div data-anim>
          <Slide017 />
        </div>
      </SlideGSAPSection>
    </div>
  );
}

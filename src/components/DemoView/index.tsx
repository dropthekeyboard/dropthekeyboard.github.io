import { LeftSection } from "./LeftSection";
import { CenterSection } from "./CenterSection";
import { RightSection } from "./RightSection";

export function DemoView() {
  return (
    <div id="demoview" className="demo-view">
      <div className="horizontal-sections">
        <LeftSection />
        <CenterSection />
        <RightSection />
      </div>
    </div>
  );
}

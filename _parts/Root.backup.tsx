import React from "react";
import { Composition } from "remotion";
import { MenuBuilderVideo, TOTAL_FRAMES as MENU_FRAMES } from "./MenuBuilderVideo";
import { SkillbnkIntroVideo, INTRO_FRAMES } from "./SkillbnkIntroVideo";
import { SkillbnkOutroVideo, OUTRO_FRAMES } from "./SkillbnkOutroVideo";
import { OrgOnboardingVideo, TOTAL_FRAMES as ORG_FRAMES } from "./OrgOnboardingVideo";
import { LMSProblemVideo, TOTAL_FRAMES as LMS_FRAMES } from "./LMSProblemVideo";
import { HVACTrainingVideo, TOTAL_FRAMES as HVAC_FRAMES } from "./HVACTrainingVideo";
import { PortalsVideo, TOTAL_FRAMES as PORTALS_FRAMES } from "./PortalsVideo";
import { MockInterviewVideo, TOTAL_FRAMES as MOCK_FRAMES } from "./MockInterviewVideo";
import { EnrollmentFlowVideo, TOTAL_FRAMES as ENROLL_FRAMES } from "./EnrollmentFlowVideo";
import { TrainingFollowUpVideo, TOTAL_FRAMES as FOLLOWUP_FRAMES } from "./TrainingFollowUpVideo";
import { LessonFlowVideo, TOTAL_FRAMES as LESSON_FRAMES } from "./LessonFlowVideo";

// Every duration comes from its video file (TOTAL_FRAMES), which includes the
// MAIN INTRO length — so nothing here needs hand-editing.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MenuBuilderVideo"
        component={MenuBuilderVideo}
        durationInFrames={MENU_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SkillbnkIntroVideo"
        component={SkillbnkIntroVideo}
        durationInFrames={INTRO_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SkillbnkOutroVideo"
        component={SkillbnkOutroVideo}
        durationInFrames={OUTRO_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="OrgOnboardingVideo"
        component={OrgOnboardingVideo}
        durationInFrames={ORG_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LMSProblemVideo"
        component={LMSProblemVideo}
        durationInFrames={LMS_FRAMES}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="HVACTrainingVideo"
        component={HVACTrainingVideo}
        durationInFrames={HVAC_FRAMES}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="PortalsVideo"
        component={PortalsVideo}
        durationInFrames={PORTALS_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="MockInterviewVideo"
        component={MockInterviewVideo}
        durationInFrames={MOCK_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="EnrollmentFlowVideo"
        component={EnrollmentFlowVideo}
        durationInFrames={ENROLL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TrainingFollowUpVideo"
        component={TrainingFollowUpVideo}
        durationInFrames={FOLLOWUP_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LessonFlowVideo"
        component={LessonFlowVideo}
        durationInFrames={LESSON_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

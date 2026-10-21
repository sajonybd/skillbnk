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
import { ChangeTrainingVideo, TOTAL_FRAMES as CHANGE_FRAMES } from "./ChangeTrainingVideo";
import { SalesPlaybookVideo, TOTAL_FRAMES as SALES_FRAMES } from "./SalesPlaybookVideo";
import { ApplyCompanyVideo, TOTAL_FRAMES as APPLY_FRAMES } from "./ApplyCompanyVideo";
import { WhiteLabelVideo, TOTAL_FRAMES as WL_FRAMES } from "./WhiteLabelVideo";
import { CustomDomainVideo, TOTAL_FRAMES as CD_FRAMES } from "./CustomDomainVideo";
import { WebsiteBuilderVideo, TOTAL_FRAMES as WB_FRAMES } from "./WebsiteBuilderVideo";
import { PromoCodesVideo, TOTAL_FRAMES as PRC_FRAMES } from "./PromoCodesVideo";
import { SmsCampaignsVideo, TOTAL_FRAMES as SMC_FRAMES } from "./SmsCampaignsVideo";
import { EmailCampaignsVideo, TOTAL_FRAMES as EMC_FRAMES } from "./EmailCampaignsVideo";
import { IntegrationsVideo, TOTAL_FRAMES as IG_FRAMES } from "./IntegrationsVideo";
import { TeamAccessVideo, TOTAL_FRAMES as TA_FRAMES } from "./TeamAccessVideo";
import { ManageLocationsVideo, TOTAL_FRAMES as ML_FRAMES } from "./ManageLocationsVideo";
import { FormBuilderVideo, TOTAL_FRAMES as FB_FRAMES } from "./FormBuilderVideo";
import { FormResponsesVideo, TOTAL_FRAMES as FR_FRAMES } from "./FormResponsesVideo";
import { EnrollmentFormBuilderVideo, TOTAL_FRAMES as EFB_FRAMES } from "./EnrollmentFormBuilderVideo";
import { RealEstateTrainingVideo, TOTAL_FRAMES as REALESTATE_FRAMES } from "./RealEstateTrainingVideo";
import { ReelBulkEnrollVideo, TOTAL_FRAMES as REEL_FRAMES } from "./ReelBulkEnrollVideo";
import { UrlShortenerStoryVideo, TOTAL_FRAMES as URL_FRAMES } from "./UrlShortenerStoryVideo";
import { CourseManageStoryVideo, TOTAL_FRAMES as COURSE_FRAMES } from "./CourseManageStoryVideo";
import { LearnerStatusStoryVideo, TOTAL_FRAMES as STATUS_FRAMES } from "./LearnerStatusStoryVideo";
import { AssignmentsStoryVideo, TOTAL_FRAMES as ASSIGN_FRAMES } from "./AssignmentsStoryVideo";
import { ProgressStoryVideo, TOTAL_FRAMES as PROGRESS_FRAMES } from "./ProgressStoryVideo";
import { MediaShareStoryVideo, TOTAL_FRAMES as MEDIA_FRAMES } from "./MediaShareStoryVideo";
import { DocsLabsStoryVideo, TOTAL_FRAMES as DOCS_FRAMES } from "./DocsLabsStoryVideo";
import { LearnerNotesStoryVideo, TOTAL_FRAMES as NOTES_FRAMES } from "./LearnerNotesStoryVideo";
import { TranscriptionStoryVideo, TOTAL_FRAMES as TRX_FRAMES } from "./TranscriptionStoryVideo";
import { ChatStoryVideo, TOTAL_FRAMES as CHAT_FRAMES } from "./ChatStoryVideo";
import { CommunityStoryVideo, TOTAL_FRAMES as COMM_FRAMES } from "./CommunityStoryVideo";
import { GroupsStoryVideo, TOTAL_FRAMES as GRP_FRAMES } from "./GroupsStoryVideo";
import { ChatBotsStoryVideo, TOTAL_FRAMES as BOTS_FRAMES } from "./ChatBotsStoryVideo";
import { CalendarStoryVideo, TOTAL_FRAMES as CAL_FRAMES } from "./CalendarStoryVideo";
import { AvailabilityStoryVideo, TOTAL_FRAMES as AV_FRAMES } from "./AvailabilityStoryVideo";
import { StaffAttendanceStoryVideo, TOTAL_FRAMES as SA_FRAMES } from "./StaffAttendanceStoryVideo";
import { CertificatesStoryVideo, TOTAL_FRAMES as CERT_FRAMES } from "./CertificatesStoryVideo";
import { TemplatesStoryVideo, TOTAL_FRAMES as TPL_FRAMES } from "./TemplatesStoryVideo";
import { SlidesStoryVideo, TOTAL_FRAMES as SLIDES_FRAMES } from "./SlidesStoryVideo";
import { InterviewLibraryStoryVideo, TOTAL_FRAMES as IQ_FRAMES } from "./InterviewLibraryStoryVideo";
import { FiveNeedsReelVideo, TOTAL_FRAMES as FIVE_FRAMES } from "./FiveNeedsReelVideo";
import { ReelBulkStoryVideo, TOTAL_FRAMES as STORY_FRAMES } from "./ReelBulkStoryVideo";

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
      <Composition
        id="ChangeTrainingVideo"
        component={ChangeTrainingVideo}
        durationInFrames={CHANGE_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="RealEstateTrainingVideo"
        component={RealEstateTrainingVideo}
        durationInFrames={REALESTATE_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SalesPlaybookVideo"
        component={SalesPlaybookVideo}
        durationInFrames={SALES_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ApplyCompanyVideo"
        component={ApplyCompanyVideo}
        durationInFrames={APPLY_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="WhiteLabelVideo"
        component={WhiteLabelVideo}
        durationInFrames={WL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CustomDomainVideo"
        component={CustomDomainVideo}
        durationInFrames={CD_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="WebsiteBuilderVideo"
        component={WebsiteBuilderVideo}
        durationInFrames={WB_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="EnrollmentFormBuilderVideo"
        component={EnrollmentFormBuilderVideo}
        durationInFrames={EFB_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FormBuilderVideo"
        component={FormBuilderVideo}
        durationInFrames={FB_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FormResponsesVideo"
        component={FormResponsesVideo}
        durationInFrames={FR_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ManageLocationsVideo"
        component={ManageLocationsVideo}
        durationInFrames={ML_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TeamAccessVideo"
        component={TeamAccessVideo}
        durationInFrames={TA_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="IntegrationsVideo"
        component={IntegrationsVideo}
        durationInFrames={IG_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="EmailCampaignsVideo"
        component={EmailCampaignsVideo}
        durationInFrames={EMC_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SmsCampaignsVideo"
        component={SmsCampaignsVideo}
        durationInFrames={SMC_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PromoCodesVideo"
        component={PromoCodesVideo}
        durationInFrames={PRC_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ReelBulkEnrollVideo"
        component={ReelBulkEnrollVideo}
        durationInFrames={REEL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition id="UrlShortenerStoryVideo" component={UrlShortenerStoryVideo} durationInFrames={URL_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="CourseManageStoryVideo" component={CourseManageStoryVideo} durationInFrames={COURSE_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="LearnerStatusStoryVideo" component={LearnerStatusStoryVideo} durationInFrames={STATUS_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="AssignmentsStoryVideo" component={AssignmentsStoryVideo} durationInFrames={ASSIGN_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="ProgressStoryVideo" component={ProgressStoryVideo} durationInFrames={PROGRESS_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="MediaShareStoryVideo" component={MediaShareStoryVideo} durationInFrames={MEDIA_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="DocsLabsStoryVideo" component={DocsLabsStoryVideo} durationInFrames={DOCS_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="LearnerNotesStoryVideo" component={LearnerNotesStoryVideo} durationInFrames={NOTES_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="TranscriptionStoryVideo" component={TranscriptionStoryVideo} durationInFrames={TRX_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="ChatStoryVideo" component={ChatStoryVideo} durationInFrames={CHAT_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="CommunityStoryVideo" component={CommunityStoryVideo} durationInFrames={COMM_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="GroupsStoryVideo" component={GroupsStoryVideo} durationInFrames={GRP_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="ChatBotsStoryVideo" component={ChatBotsStoryVideo} durationInFrames={BOTS_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="CalendarStoryVideo" component={CalendarStoryVideo} durationInFrames={CAL_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="AvailabilityStoryVideo" component={AvailabilityStoryVideo} durationInFrames={AV_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="StaffAttendanceStoryVideo" component={StaffAttendanceStoryVideo} durationInFrames={SA_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="CertificatesStoryVideo" component={CertificatesStoryVideo} durationInFrames={CERT_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="TemplatesStoryVideo" component={TemplatesStoryVideo} durationInFrames={TPL_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="SlidesStoryVideo" component={SlidesStoryVideo} durationInFrames={SLIDES_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="InterviewLibraryStoryVideo" component={InterviewLibraryStoryVideo} durationInFrames={IQ_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="FiveNeedsReelVideo" component={FiveNeedsReelVideo} durationInFrames={FIVE_FRAMES} fps={30} width={1080} height={1920} />
      <Composition
        id="ReelBulkStoryVideo"
        component={ReelBulkStoryVideo}
        durationInFrames={STORY_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};

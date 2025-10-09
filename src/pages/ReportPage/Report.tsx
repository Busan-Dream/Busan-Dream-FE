import SectionTitle from "@/components/SectionTitle";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAnalysis } from "@/contexts/AnalysisContext";
import { useVideoUpload } from "@/hooks/useVideoUpload";
import { toast } from "sonner";
import { Download } from "lucide-react";
import AnalysisStatus from "./components/AnalysisStatus";
import ScoreSection from "./components/ScoreSection";
import VoiceAnalysis from "./components/VoiceAnalysis";
import RepetitiveVocabulary from "./components/RepetitiveVocabulary";
import VideoAnalysis from "./components/VideoAnalysis";
import DetailedFeedback from "./components/DetailedFeedback";
import AnalysisSkeleton from "./components/AnalysisSkeleton";

// 이미지 import
import womanBlackHairLoading from "@/assets/images/Report/loading/woman-black-hair-loading.png";
import womanGrayHairLoading from "@/assets/images/Report/loading/woman-gray-hair-loading.png";
import manWhiteHairLoading from "@/assets/images/Report/loading/man-white-hair-loading.png";
import manGrayHairLoading from "@/assets/images/Report/loading/man-gray-hair-loading.png";
import manBlackHairLoading from "@/assets/images/Report/loading/man-black-hair-loading.png";
import womanWhiteHairLoading from "@/assets/images/Report/loading/woman-white-hair-loading.png";

import womanBlackHairTada from "@/assets/images/Report/finish/woman-black-hair-tada.png";
import womanGrayHairTada from "@/assets/images/Report/finish/woman-gray-hair-tada.png";
import womanWhiteHairTada from "@/assets/images/Report/finish/woman-white-hair-tada.png";
import manBlackHairTada from "@/assets/images/Report/finish/man-black-hair-tada.png";
import manGrayHairTada from "@/assets/images/Report/finish/man-gray-hair-tada.png";
import manWhiteHairTada from "@/assets/images/Report/finish/man-white-hair-tada.png";

const Report = () => {
  const location = useLocation();
  const { postingOrgan, postingPart } = location.state || {};
  const { analysisStatus, individualStatus } = useAnalysis();
  const { downloadVideo, restoreVideoFromSession, savedVideoUrl } =
    useVideoUpload();

  // 이미지 배열
  const imageMapping = [
    {
      loading: womanBlackHairLoading,
      finish: womanBlackHairTada,
    },
    {
      loading: womanGrayHairLoading,
      finish: womanGrayHairTada,
    },
    {
      loading: manWhiteHairLoading,
      finish: manWhiteHairTada,
    },
    {
      loading: manGrayHairLoading,
      finish: manGrayHairTada,
    },
    {
      loading: manBlackHairLoading,
      finish: manBlackHairTada,
    },
    {
      loading: womanWhiteHairLoading,
      finish: womanWhiteHairTada,
    },
  ];

  const [randomIndex] = useState(() =>
    Math.floor(Math.random() * imageMapping.length)
  );

  // 분석 완료 여부 확인
  const isAnalysisComplete =
    analysisStatus === "completed" ||
    (individualStatus.audio === "completed" &&
      individualStatus.video === "completed");

  // 현재 표시할 이미지
  const currentImage = isAnalysisComplete
    ? imageMapping[randomIndex].finish
    : imageMapping[randomIndex].loading;

  // 페이지 로드 시 세션 스토리지에서 영상 복원
  useEffect(() => {
    restoreVideoFromSession();
  }, [restoreVideoFromSession]);

  return (
    <section className="min-h-screen py-6 max-sm:py-4 max-sm:landscape:py-2">
      {/* 메인 타이틀 섹션 */}
      <div className="mb-8 gap-3 pb-4 pt-8 max-[1440px]:px-8 px-6">
        <SectionTitle
          title="AI 분석 결과 리포트"
          description="AI가 분석을 완료했어요✨ 사용자님의 면접 결과를 알려드릴게요!"
          className="gap-3"
        />

        {/* 영상 다운로드 버튼 */}
        {savedVideoUrl && (
          <div className="flex justify-end mt-4">
            <button
              onClick={async () => {
                try {
                  const success = await downloadVideo();
                  if (success) {
                    toast.success("영상 다운로드가 완료되었습니다!");
                  } else {
                    toast.error("영상 다운로드에 실패했습니다.", {
                      description: "영상 파일을 찾을 수 없습니다.",
                    });
                  }
                } catch {
                  toast.error("영상 다운로드 중 오류가 발생했습니다.", {
                    description: "다시 시도해주세요.",
                  });
                }
              }}
              className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
              title="녹화된 영상 다운로드"
            >
              <Download className="w-4 h-4" />
              영상 다운로드
            </button>
          </div>
        )}
      </div>

      <article className="w-full max-sm:px-4 max-sm:landscape:px-2 bg-[#F4F6FA] border border-gray-200 rounded-4xl">
        <AnalysisStatus
          postingOrgan={postingOrgan}
          postingPart={postingPart}
          characterImage={currentImage}
        />

        {analysisStatus === "error" ? (
          <div className="p-8 text-center">
            <h3 className="text-xl font-semibold text-red-600 mb-4">
              분석 중 오류가 발생했습니다
            </h3>
            <p className="text-gray-600">다시 시도해주세요.</p>
          </div>
        ) : (
          <>
            <ScoreSection />

            {/* 음성 분석 결과 */}
            {individualStatus.audio === "analyzing" ? (
              <>
                <AnalysisSkeleton type="audio" />
                <AnalysisSkeleton type="vocabulary" />
              </>
            ) : individualStatus.audio === "completed" ? (
              <>
                <VoiceAnalysis />
                <RepetitiveVocabulary />
              </>
            ) : null}

            {/* 영상 분석 결과 */}
            {individualStatus.video === "analyzing" ? (
              <AnalysisSkeleton type="video" />
            ) : individualStatus.video === "completed" ? (
              <VideoAnalysis />
            ) : null}

            {/* 상세 피드백 */}
            {individualStatus.video === "analyzing" ||
            individualStatus.audio === "analyzing" ? (
              <AnalysisSkeleton type="feedback" />
            ) : individualStatus.video === "completed" ||
              individualStatus.audio === "completed" ? (
              <DetailedFeedback />
            ) : null}
          </>
        )}
      </article>
    </section>
  );
};

export default Report;

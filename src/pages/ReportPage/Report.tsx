import SectionTitle from "@/components/SectionTitle";
import { useState, useEffect } from "react";
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
import SplashCursor from "@/components/ReactBits/SplashCursor/SplashCursor";

// 이미지 import
import womanBlackHairLoading from "@/assets/images/Report/loading/woman-black-hair-loading.png";
import womanGrayHairLoading from "@/assets/images/Report/loading/woman-gray-hair-loading.png";
import manWhiteHairLoading from "@/assets/images/Report/loading/man-white-hair-loading.png";
import manGrayHairLoading from "@/assets/images/Report/loading/man-gray-hair-loading.png";
import manBlackHairLoading from "@/assets/images/Report/loading/man-black-hair-loading.png";
import womanWhiteHairLoading from "@/assets/images/Report/loading/woman-white-hair-loading.png";

import womanWhiteHairTada from "@/assets/images/Report/finish/woman-white-hair-tada.png";
import womanGrayHairTada from "@/assets/images/Report/finish/woman-gray-hair-tada.png";
import womanBlackHairTada from "@/assets/images/Report/finish/woman-black-hair-tada.png";
import manBlackHairTada from "@/assets/images/Report/finish/man-black-hair-tada.png";
import manGrayHairTada from "@/assets/images/Report/finish/man-gray-hair-tada.png";
import womanWhiteHairTada1 from "@/assets/images/Report/finish/woman-white-hair-tada-1.png";
import Loading from "@/components/Loading";

const Report = () => {
  const location = useLocation();
  const { postingOrgan, postingPart } = location.state || {};
  const { analysisStatus, analysisResults, individualStatus } = useAnalysis();
  const { downloadVideo, restoreVideoFromSession, savedVideoUrl } =
    useVideoUpload();
  const [isLoading, setIsLoading] = useState(true);
  const [randomImage, setRandomImage] = useState("");
  const [showMouseHint, setShowMouseHint] = useState(true);

  // 페이지 로드 시 세션 스토리지에서 영상 복원
  useEffect(() => {
    restoreVideoFromSession();
  }, [restoreVideoFromSession]);

  // 분석 상태에 따라 로딩 상태 결정
  useEffect(() => {
    if (
      analysisStatus === "completed" &&
      (analysisResults.video || analysisResults.audio)
    ) {
      setIsLoading(false);
    } else if (analysisStatus === "error") {
      setIsLoading(false);
    } else if (analysisStatus === "analyzing") {
      setIsLoading(true);
      setShowMouseHint(true);
      // 마우스 이펙트 안내 토스트 표시
      toast.info("분석 결과를 기다리는 동안 마우스를 움직여보세요!", {
        description: "물감이 퍼지는듯한 애니메이션을 경험해보세요 ✨",
        duration: 5000,
      });
    }
  }, [analysisStatus, analysisResults]);

  // 마우스 움직임 감지하여 안내 메시지 숨기기
  useEffect(() => {
    if (!isLoading || !showMouseHint) return;

    const handleMouseMove = () => {
      setShowMouseHint(false);
    };

    // 3초 후 자동으로 숨기기
    const timer = setTimeout(() => {
      setShowMouseHint(false);
    }, 3000);

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isLoading, showMouseHint]);

  // 이미지 배열
  const loadingImages = [
    womanBlackHairLoading,
    womanGrayHairLoading,
    manWhiteHairLoading,
    manGrayHairLoading,
    manBlackHairLoading,
    womanWhiteHairLoading,
  ];

  const finishImages = [
    womanWhiteHairTada,
    womanGrayHairTada,
    womanBlackHairTada,
    manBlackHairTada,
    manGrayHairTada,
    womanWhiteHairTada1,
  ];

  useEffect(() => {
    // 랜덤 이미지 선택
    const images = isLoading ? loadingImages : finishImages;
    const randomIndex = Math.floor(Math.random() * images.length);
    setRandomImage(images[randomIndex]);

    // 3초 후 로딩 완료
    const timer = setTimeout(() => {
      setIsLoading(false);
      const finishRandomIndex = Math.floor(Math.random() * finishImages.length);
      setRandomImage(finishImages[finishRandomIndex]);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <section className="min-h-screen py-6 max-sm:py-4 max-sm:landscape:py-2">
      {/* SplashCursor 로딩 애니메이션 */}
      {isLoading && (
        <>
          <SplashCursor />
          {/* 마우스 이펙트 안내 메시지 */}
          {showMouseHint && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] text-center pointer-events-none">
              <div className="bg-black/70 text-white px-6 py-4 rounded-lg backdrop-blur-sm animate-pulse">
                <p className="text-lg font-medium mb-2">
                  마우스를 움직여보세요!
                </p>
                <p className="text-sm opacity-90">
                  물감이 퍼지는듯한 애니메이션을 경험해보세요 ✨
                </p>
              </div>
            </div>
          )}
        </>
      )}

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
                const success = await downloadVideo();
                if (success) {
                  toast.success("영상 다운로드가 완료되었습니다!");
                } else {
                  toast.error("영상 다운로드에 실패했습니다.", {
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
          randomImage={randomImage}
          isLoading={isLoading}
          postingOrgan={postingOrgan}
          postingPart={postingPart}
        />

        {isLoading ? (
          <Loading />
        ) : analysisStatus === "error" ? (
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

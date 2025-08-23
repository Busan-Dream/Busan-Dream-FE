import TextPressure from "@/components/ReactBits/TextPressure/TextPressure";
import SplitText from "@/components/ReactBits/SplitText/SplitText";
import { Link } from "react-router-dom";

interface MemberInfoProps {
  role: string;
  name: string;
  githubId: string;
}

export const MemberInfo = ({ role, name, githubId }: MemberInfoProps) => {
  return (
    <div className="flex justify-between items-center gap-4">
      <p className="flex w-[124px] justify-between items-center gap-2">
        <strong className="text-gray-300">{role}</strong>
        <span className="text-gray-400">{name}</span>
      </p>
      <Link
        to={`https://github.com/${githubId}`}
        target="_blank"
        className="text-gray-400 hover:text-gray-300"
      >
        @{githubId}
      </Link>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="w-full max-h-fit  bg-gray-900 text-gray-300 py-12 px-8">
      <div className="h-[150px] sm:h-fit max-h-fit max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        {/* 왼쪽 섹션 - 이벤트 정보 */}
        <div className="flex flex-col gap-4 h-full justify-between">
          <div className="flex flex-col relative">
            <div style={{ position: "relative", height: "100px" }}>
              <TextPressure
                text="DIVE 2025"
                flex={true}
                alpha={false}
                stroke={false}
                width={true}
                weight={true}
                italic={true}
                textColor="#9ca3af"
                strokeColor="#ff0000"
                minFontSize={36}
              />
            </div>
            <p className="text-lg text-gray-300 tracking-wide font-paperlogy absolute -bottom-1 left-0">
              2nd Global Data Hackathon
            </p>
          </div>
          <p className="text-sm font-light text-gray-400 tracking-wide">
            <b className="font-bold">데이터 제공 | </b>
            부산시 산하공사공단 공공데이터 실무협의체
          </p>
        </div>

        {/* 오른쪽 섹션 - 팀 정보 */}
        <div className="flex flex-col gap-4 min-[768px]:items-end">
          <SplitText
            text="@TEAM 고공비행단"
            className="text-lg text-gray-300 uppercase tracking-wide"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="0px"
            textAlign="left"
          />
          <div className="flex flex-col gap-2 text-sm text-gray-300 tracking-widen">
            <MemberInfo
              role="팀장/기획/BE"
              name="정은아"
              githubId="eunah0507"
            />
            <MemberInfo role="AI/BE" name="오의석" githubId="ohuiseok" />
            <MemberInfo role="디자인/FE" name="김보민" githubId="WHOOZ-23" />
            <MemberInfo role="디자인/FE" name="권윤슬" githubId="miseullang" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

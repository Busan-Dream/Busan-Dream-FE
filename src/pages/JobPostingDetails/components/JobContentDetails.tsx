const JobContentDetails = () => {
  return (
    <>
      <div className="space-y-5">
        <h2 className="text-xl font-semibold">전형 절차</h2>
        <span className="text-base text-gray-500">
          1차 필기시험, 2차 인성검사, 3차 면접시험
        </span>
      </div>
      <div className="space-y-5">
        <h2 className="text-xl font-semibold">채용 방법</h2>
        <span className="text-base text-gray-500">
          NCS 기반 직무능력 중심 채용
        </span>
      </div>
      <div className="space-y-5">
        <h2 className="text-xl font-semibold">임용 조건</h2>
        <span className="text-base/24px text-gray-500">
          <ul className="list-disc space-y-2 pl-5">
            <li>만 18세 이상 (2006.12.31. 이전 출생자)</li>
            <li>공사 정년(만 60세) 범위 내</li>
            <li>공사가 지정한 날에 출근 또는 교육 참여 가능자</li>
            <li>직무 특성상 주·야간 교대(교번)근무 및 초과근로 가능자</li>
            <li>
              다음 중 하나 이상을 충족해야 함:
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  2023.12.31. 이전부터 면접시험 최종일까지 부산광역시,
                  울산광역시, 경상남도에 주민등록상 거주하고 있으며, 거주
                  불명이나 말소 사실이 없는 자
                </li>
                <li>
                  2023.12.31. 이전까지 해당 지역(부산, 울산, 경남)에 주민등록상
                  주소지를 두었던 기간을 모두 합산하여 총 3년(36개월) 이상인 자
                </li>
              </ul>
            </li>
          </ul>
        </span>
      </div>
    </>
  );
};

export default JobContentDetails;

interface JobContentDetailsProps {
  postingFieldMethod: string;
  postingIncruit: string;
  postingCondition: string;
}

const JobContentDetails = ({
  postingFieldMethod,
  postingIncruit,
  postingCondition,
}: JobContentDetailsProps) => {
  // 임용 조건 '|' 기준으로 줄바꿈
  const items = postingCondition.split("|").map(s => s.trim());

  return (
    <>
      <div className="space-y-5">
        <h2 className="text-xl font-semibold">전형 절차</h2>
        <span className="text-base text-gray-500">{postingFieldMethod}</span>
      </div>
      <div className="space-y-5">
        <h2 className="text-xl font-semibold">채용 방법</h2>
        <span className="text-base text-gray-500">{postingIncruit}</span>
      </div>
      <div className="space-y-5">
        <h2 className="text-xl font-semibold">임용 조건</h2>
        <span className="text-base/24px text-gray-500">
          <ul className="list-disc space-y-2 pl-5">
            {items.map((item, idx) => {
              if (item.startsWith(">")) {
                // > 있으면 하위 리스트
                return (
                  <ul key={idx} className="list-disc space-y-2 pl-5">
                    <li>{item.replace(/^>/, "").trim()}</li>
                  </ul>
                );
              } else {
                return <li key={idx}>{item}</li>;
              }
            })}
          </ul>
        </span>
      </div>
    </>
  );
};

export default JobContentDetails;

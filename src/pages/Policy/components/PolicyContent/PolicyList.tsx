import PolicyCardHeader from "./PolicyCardHeader";
import PolicyCard from "./PolicyCard";
import DecryptedText from "@/components/ReactBits/DecryptedText/DecryptedText";
import { Policy } from "@/apis/policy";

interface PolicyListProps {
  policies: Policy[];
  loading: boolean;
  error: string | null;
  category: "work" | "house" | "busan" | "life";
}

const PolicyList = ({
  policies,
  loading,
  error,
  category,
}: PolicyListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">정책 목록을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[500px] flex flex-col items-center justify-center py-8 px-10">
        <DecryptedText
          text="데이터를 불러오는 중 오류가 발생했습니다."
          animateOn="both"
          speed={100}
          className="text-2xl text-gray-800"
        />
        <DecryptedText
          text={error}
          animateOn="both"
          speed={100}
          className="text-2xl text-gray-800"
        />
      </div>
    );
  }

  if (policies.length === 0) {
    return (
      <div className="w-full min-h-[500px] flex flex-col items-center justify-center py-8 px-10">
        <DecryptedText
          text="해당 조건에 맞는 정책이 없습니다."
          animateOn="both"
          speed={100}
          className="text-xl text-gray-800"
        />
      </div>
    );
  }

  return (
    <div>
      <PolicyCardHeader category={category} />

      {/* 정책 카드 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {policies.map((policy, index) => (
          <PolicyCard key={`${policy.policyTitle}-${index}`} policy={policy} />
        ))}
      </div>
    </div>
  );
};

export default PolicyList;

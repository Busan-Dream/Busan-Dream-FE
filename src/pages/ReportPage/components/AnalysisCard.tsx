interface AnalysisCardProps {
  title: string;
  description: string;
}

const AnalysisCard = ({ title, description }: AnalysisCardProps) => {
  return (
    <div className="flex flex-col gap-4 bg-white rounded-2xl py-10 px-8">
      <h3 className="font-semibold text-2xl text-[#3A00FF]">{title}</h3>
      <p className="text-lg text-gray-600/60 text-light">{description}</p>
    </div>
  );
};

export default AnalysisCard;

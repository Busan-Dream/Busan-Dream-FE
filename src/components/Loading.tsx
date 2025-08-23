interface LoadingProps {
  message?: string;
  description?: string;
}

const Loading = ({
  message = "분석 데이터를 준비하고 있어요...",
  description = "마우스를 움직여보세요!",
}: LoadingProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{message}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default Loading;

import React from "react";
import { Calendar, Home, Heart, Sparkles } from "lucide-react";

interface PolicyCardHeader {
  id: string;
  icon: React.ReactNode;
  title: string;
}

const PolicyCardHeaders: PolicyCardHeader[] = [
  {
    id: "work",
    icon: <Calendar className="w-6 h-6" />,
    title: "일자리",
  },
  {
    id: "housing",
    icon: <Home className="w-6 h-6" />,
    title: "주거",
  },
  {
    id: "life",
    icon: <Heart className="w-6 h-6" />,
    title: "생활",
  },
  {
    id: "settlement",
    icon: <Sparkles className="w-6 h-6" />,
    title: "정착",
  },
];

interface PolicyCardHeaderProps {
  category: string;
}

const PolicyCardHeader = ({ category }: PolicyCardHeaderProps) => {
  const headerData = PolicyCardHeaders.find((header) => header.id === category);

  if (!headerData) return null;

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        {headerData.icon}
        <h3 className="text-2xl font-bold text-gray-900">{headerData.title}</h3>
      </div>
      <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
        더보기
      </button>
    </div>
  );
};

export default PolicyCardHeader;

import React from "react";
import { Calendar, Home, Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PolicyCardHeader {
  id: string;
  icon: React.ReactNode;
  title: string;
  path: string;
}

const PolicyCardHeaders: PolicyCardHeader[] = [
  {
    id: "work",
    icon: <Calendar className="w-6 h-6" />,
    title: "일자리",
    path: "work",
  },
  {
    id: "house",
    icon: <Home className="w-6 h-6" />,
    title: "주거",
    path: "house",
  },
  {
    id: "life",
    icon: <Heart className="w-6 h-6" />,
    title: "생활",
    path: "life",
  },
  {
    id: "busan",
    icon: <MapPin className="w-6 h-6" />,
    title: "부산",
    path: "busan",
  },
];

interface PolicyCardHeaderProps {
  category: string;
  onMoreClick?: (categoryPath: string) => void;
}

const PolicyCardHeader = ({ category, onMoreClick }: PolicyCardHeaderProps) => {
  const headerData = PolicyCardHeaders.find((header) => header.id === category);

  if (!headerData) return null;

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        {headerData.icon}
        <h3 className="text-2xl font-medium text-gray-900">
          {headerData.title}
        </h3>
      </div>
      {onMoreClick && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onMoreClick(headerData.path)}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
        >
          더보기
        </Button>
      )}
    </div>
  );
};

export default PolicyCardHeader;

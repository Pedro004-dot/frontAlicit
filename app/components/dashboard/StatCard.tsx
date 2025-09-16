interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendText: string;
  icon: string;
  color: string;
}

export default function StatCard({ title, value, trend, trendText, icon, color }: StatCardProps) {
  const getIcon = () => {
    switch (icon) {
      case 'check':
        return (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-[#333333] mt-2">{value}</p>
        </div>
        <div className="p-3 bg-[#F78F20] rounded-full">
          {getIcon()}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <span className="text-green-500 text-sm font-medium">{trend}</span>
        <span className="text-gray-600 text-sm ml-2">{trendText}</span>
      </div>
    </div>
  );
}

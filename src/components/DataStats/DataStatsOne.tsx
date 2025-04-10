'use client';

import { useState, useEffect } from "react";
import { HandCoins, Handshake, LucideSprout, Tractor } from 'lucide-react';

interface Analytics {
  total_farmers: number;
  total_aid_value: number;
  eligible_farmers: number;
  top_crop: {
    name: string;
    season: string;
    count: number;
    locations: string[];
  };
  growth_rate: number;
}

const DataStatsOne = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading || !analytics) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark animate-pulse">
            <div className="h-14.5 w-14.5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="mt-6">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="mt-2 h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const dataStatsList = [
    {
      icon: (<Tractor color="#ffffff" />),
      color: "#8155FF",
      title: "Total Farmers",
      value: analytics.total_farmers.toLocaleString(),

    },
    {
      icon: (<HandCoins color="#ffffff" />),
      color: "#FF9C55",
      title: "Total Aid Value",
      value: `₱${analytics.total_aid_value.toLocaleString()}`,
      growthRate: analytics.growth_rate,
    },
    {
      icon: (<Handshake color="#ffffff" />),
      color: "#18BFFF",
      title: "Unassisted Farmers",
      subtitle: "(This month)",
      value: analytics.eligible_farmers.toLocaleString(),

    },
    {
      icon: (<LucideSprout color="#fff"/>),
      color: "#3FD97F",
      title: `Top Crop (${analytics.top_crop.season} Season)`,
      value: analytics.top_crop.name === 'No crops' 
        ? 'No crops yet'
        : `${analytics.top_crop.name} (${analytics.top_crop.count} farmers)`,
      subtitle: analytics.top_crop.name === 'No crops' 
        ? ''
        : `Grown in: ${analytics.top_crop.locations.join(', ')}`,

    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {dataStatsList.map((item, index) => (
          <div
            key={index}
            className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark"
          >
            <div
              className="flex h-14.5 w-14.5 items-center justify-center rounded-full"
              style={{ backgroundColor: item.color }}
            >
              {item.icon}
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <h4 className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
                  {item.value}
                </h4>
                <span className="text-body-sm font-medium">{item.title}</span>
                {item.subtitle && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {item.subtitle}
                  </p>
                )}
              </div>

              {item.growthRate && (
                <span
                className={`flex items-center gap-1.5 text-body-sm font-medium ${
                  item.growthRate > 0 ? "text-green" : "text-red"
                }`}
              >
                {item.growthRate.toFixed(1)}%
                {item.growthRate > 0 ? (
                  <svg
                    className="fill-current"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.35716 2.3925L0.908974 5.745L5.0443e-07 4.86125L5 -5.1656e-07L10 4.86125L9.09103 5.745L5.64284 2.3925L5.64284 10L4.35716 10L4.35716 2.3925Z"
                      fill=""
                    />
                  </svg>
                ) : (
                  <svg
                    className="fill-current"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.64284 7.6075L9.09102 4.255L10 5.13875L5 10L-8.98488e-07 5.13875L0.908973 4.255L4.35716 7.6075L4.35716 7.6183e-07L5.64284 9.86625e-07L5.64284 7.6075Z"
                      fill=""
                    />
                  </svg>
                )}
              </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DataStatsOne;

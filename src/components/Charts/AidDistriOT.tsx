'use client';

import { ApexOptions } from "apexcharts";
import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

interface ChartData {
  monthly_values: number[];
  monthly_count: number[];
  total_value: number;
  total_count: number;
}

const AidDistriOT = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics/aid-distribution');
        if (!response.ok) {
          throw new Error('Failed to fetch chart data');
        }
        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const series = [
    {
      name: "Aid Value (₱)",
      data: chartData?.monthly_values || Array(12).fill(0),
    },
    {
      name: "Beneficiaries",
      data: chartData?.monthly_count || Array(12).fill(0),
    },
  ];

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#5750F1", "#0ABEF9"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    fill: {
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 320,
          },
        },
      },
    ],
    stroke: {
      curve: "smooth",
      width: 2,
    },
    markers: {
      size: 4,
      hover: {
        size: 6,
      },
    },
    grid: {
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: [{
        formatter: function (value: number) {
          return `₱${value.toLocaleString()}`;
        }
      }, {
        formatter: function (value: number) {
          return `${value} farmers`;
        }
      }]
    },
    xaxis: {
      type: "category",
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: [
      {
        title: {
          text: "Aid Value (₱)",
          style: {
            fontSize: "12px",
          },
        },
        labels: {
          formatter: function (value) {
            return `₱${value.toLocaleString()}`;
          }
        }
      },
      {
        opposite: true,
        title: {
          text: "Number of Beneficiaries",
          style: {
            fontSize: "12px",
          },
        },
        labels: {
          formatter: function (value) {
            return Math.round(value).toString();
          }
        }
      }
    ],
  };

  if (isLoading) {
    return (
      <div className="col-span-12 flex flex-col justify-between rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-7">
        <div className="animate-pulse">
          <div className="h-[310px] bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-12 flex flex-col justify-between rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-7">
      <div className="mb-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            Aid Distribution Over Time
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Distribution trends for the current year
          </p>
        </div>
      </div>

      <div>
        <div className="-ml-4 -mr-5">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={310}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
        <div>
          <p className="font-medium">Total Aid Value</p>
          <h4 className="mt-1 text-xl font-bold text-dark dark:text-white">
            ₱{chartData?.total_value.toLocaleString() || '0'}
          </h4>
        </div>
        <div>
          <p className="font-medium">Total Beneficiaries</p>
          <h4 className="mt-1 text-xl font-bold text-dark dark:text-white">
            {chartData?.total_count.toLocaleString() || '0'} farmers
          </h4>
        </div>
      </div>
    </div>
  );
};

export default AidDistriOT;

import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

interface DemographicData {
  gender: string;
  count: number;
}

const genderDisplayMap: { [key: string]: string } = {
  'M': 'Male',
  'F': 'Female',
  'Other': 'LGBTQ+'
};

const FarmerDemo: React.FC = () => {
  const [demographicData, setDemographicData] = useState<DemographicData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/analytics/farmer-demographics');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        // Map the gender values to their display names
        const mappedData = data.map((item: DemographicData) => ({
          ...item,
          gender: genderDisplayMap[item.gender] || item.gender
        }));
        setDemographicData(mappedData);
      } catch (error) {
        console.error('Error fetching demographic data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Extract series and labels from the data
  const series = demographicData.map(item => item.count);
  const labels = demographicData.map(item => item.gender);

  const options: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
    },
    colors: ["#5750F1", "#5475E5", "#8099EC"],
    labels: labels,
    legend: {
      show: false,
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
          background: "transparent",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: "Total Farmers",
              fontSize: "16px",
              fontWeight: "400",
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0).toString();
              }
            },
            value: {
              show: true,
              fontSize: "28px",
              fontWeight: "bold",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 415,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center h-[400px] text-red-500">
          <p>{error}</p>
        </div>
      );
    }

    if (demographicData.length === 0) {
      return (
        <div className="flex justify-center items-center h-[400px] text-gray-500">
          <p>No demographic data available</p>
        </div>
      );
    }

    return (
      <>
        <div className="mb-8">
          <div className="mx-auto flex justify-center">
            <ReactApexChart options={options} series={series} type="donut" />
          </div>
        </div>

        <div className="mx-auto w-full lg:max-w-[450px]">
          <div className="-mx-7.5 flex flex-wrap items-center justify-center gap-y-2.5">
            {demographicData.map((item, index) => (
              <div key={item.gender} className="w-full px-7.5 sm:w-full lg:w-1/3">
                <div className="flex w-full items-center">
                  <span 
                    className={`mr-2 block h-3 w-full max-w-3 rounded-full ${
                      index === 0 ? 'bg-blue' : 
                      index === 1 ? 'bg-blue-light' : 'bg-blue-light-2'
                    }`}
                  ></span>
                  <p className="flex w-full justify-between text-body-sm font-medium text-dark dark:text-dark-6">
                    <span>{item.gender}</span>
                    <span>{item.count}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-7 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-5">
      <div className="mb-9 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            Farmer Demographics
          </h4>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default FarmerDemo;

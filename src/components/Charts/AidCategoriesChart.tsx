'use client';

import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface AidCategoryData {
    category: string;
    count: number;
    total_value: number;
}

const AidCategoriesChart = () => {
    const [data, setData] = useState<AidCategoryData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'count' | 'value'>('count');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/analytics/aid-categories');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching aid categories:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Prepare series data
    const chartData = data.map(item => ({
        category: item.category,
        count: item.count,
        value: item.total_value || 0
    }));

    // Sort data by value for bar chart
    const sortedData = [...chartData].sort((a, b) => b.value - a.value);

    const getPieChartOptions = (): ApexOptions => ({
        chart: {
            type: 'donut',
            fontFamily: "Satoshi, sans-serif",
        },
        labels: chartData.map(item => item.category),
        colors: ['#FF5733', '#FFBD33', '#3FD97FE6', '#3380FF', '#C133FF']
,

        legend: {
            show: false,
            position: 'top',
            horizontalAlign: 'left',
            fontSize: '14px',
            markers: {
                size: 8,
                strokeWidth: 0,
                shape: 'circle',
                offsetX: 0,
                offsetY: 0
            },
            itemMargin: {
                horizontal: 8,
                vertical: 8,
            },
            formatter: function (seriesName: string, opts) {
                const value = opts.w.globals.series[opts.seriesIndex];
                const total = opts.w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                return `${seriesName}: ${value} (${percentage}%)`;
            }
        },
        stroke: {
            width: 0,
        },
        plotOptions: {
            pie: {
                donut: {
                  size: "100%",
                  background: "transparent",
                  labels: {
                    show: true,
                    total: {
                      show: false,
                      showAlways: true,
                      label: "Total Programs",
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
            style: {
                fontSize: '14px',
                fontFamily: 'Satoshi, sans-serif',
                fontWeight: 500,
            },
            formatter: function (value: number, { seriesIndex, w }) {
                const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                return percentage + '%';
            },
            dropShadow: {
                enabled: false
            }
        },
        tooltip: {
            y: {
                formatter: function (value) {
                    return `${value} ${value === 1 ? 'program' : 'programs'}`;
                }
            }
        },
        responsive: [
            {
              breakpoint: 2600,
              options: {
                chart: {
                  width: 325,
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
        
    });

    const getBarChartOptions = (): ApexOptions => ({
        chart: {
            type: 'bar',
            fontFamily: "Satoshi, sans-serif",
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 4,
                dataLabels: {
                    position: 'top',
                },
                barHeight: '60%'
            }
        },
        colors: ['#5750F1'],
        dataLabels: {
            enabled: true,
            formatter: function (value) {
                return `₱${Number(value).toLocaleString('en-US')}`;
            },
            style: {
                fontSize: '12px',
                fontWeight: 600,
            },
            offsetX: 30,
        },
        xaxis: {
            categories: sortedData.map(item => item.category),
            min: 0,
            max: 1000000,
            tickAmount: 1,
            labels: {
                formatter: function (value) {
                    return `₱${Number(value).toLocaleString('en-US')}`;
                }
            },
            title: {
                text: 'Total Value (PHP)',
                style: {
                    fontSize: '14px',
                    fontWeight: 600
                }
            }
        },
        yaxis: {
            labels: {
                show: false
            }
        },
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'right',
            fontSize: '14px',
            markers: {
                width: 8,
                height: 8,
                radius: 100
            }
        },
        tooltip: {
            x: {
                show: true
            },
            y: {
                formatter: function (value) {
                    return `₱${Number(value).toLocaleString('en-US')}`;
                }
            }
        },
        grid: {
            xaxis: {
                lines: {
                    show: true
                }
            },
            yaxis: {
                lines: {
                    show: false
                }
            }
        },
        responsive: [
            {
              breakpoint: 2600,
              options: {
                chart: {
                  width: "100%",
                  innerHeight: "auto"
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
    });

    if (isLoading) {
        return (
            <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-7 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-7">
                <div className="flex h-[400px] items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-7 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-7">
            <div className="mb-4 justify-between gap-4 sm:flex">
                <div>
                    <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
                        Aid Categories Distribution
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {viewMode === 'count'
                            ? 'Distribution of aid programs by count'
                            : 'Distribution of aid programs by value'}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode('count')}
                        className={`rounded-lg px-3 py-1 text-sm ${viewMode === 'count'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                            }`}
                    >
                        By Count
                    </button>
                    <button
                        onClick={() => setViewMode('value')}
                        className={`rounded-lg px-3 py-1 text-sm ${viewMode === 'value'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                            }`}
                    >
                        By Value
                    </button>
                </div>
            </div>

            <div className="mb-2">
                <div className="mx-auto flex justify-center w-full">
                    {viewMode === 'count' ? (
                        <ReactApexChart
                            options={getPieChartOptions()}
                            series={chartData.map(item => item.count)}
                            type="pie"
                            height="450px"
                        />
                    ) : (
                        <ReactApexChart
                            options={getBarChartOptions()}
                            series={[{
                                name: 'Total Value',
                                data: sortedData.map(item => item.value)
                            }]}
                            type="bar"
                            height="400px"
                            width="100%"
                            style={{ height:"400px",width: '100%' }}
                        />
                    )}
                </div>
            </div>

            {viewMode === 'count' && (
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
                    {chartData.map((item, index) => (
                        <div key={item.category} className="flex items-center gap-2">
                            <span
                                className={`h-3 w-3 rounded-full`}
                                style={{ backgroundColor: getPieChartOptions().colors?.[index % (getPieChartOptions().colors?.length || 1)] }}
                            ></span>
                            <span className="text-sm font-medium text-dark dark:text-white">
                            {`${item.category}: ${item.count} ${item.count === 1 ? 'program' : 'programs'}`}

                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AidCategoriesChart; 
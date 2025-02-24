import { FC, useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";

const defaultOptionForChart = {
  chart: {
    type: "column",
  },

  title: {
    text: "",
    align: "left",
  },
  subtitle: {},
  xAxis: {
    categories: [],
    title: {
      text: null,
    },

    max: 10,
    scrollbar: {
      enabled: false,
    },

    labels: {
      style: {
        color: "#A6B1BB",
        fontSize: "14px",
        fontFamily: "Poppins",
      },
    },
  },
  yAxis: {
    gridLineColor: "rgba(229, 229, 239, 0.2)",
    gridLineDashStyle: "Dash",
    title: {
      text: null,
    },
    labels: {
      style: {
        color: "#A6B1BB",
        fontSize: "14px",
        fontFamily: "Poppins",
      },
    },
  },
  tooltip: {},
  legend: {
    enabled: true,
  },
  plotOptions: {
    series: {
      borderRadius: 6,
      dataLabels: {
        enabled: true,
      },
      groupPadding: 0.02,
    },

    column: {
      dataLabels: {
        verticalAlign: "top",
      },
    },
    bar: {
      showInLegend: false,
      dataLabels: {
        enabled: true,
        style: {
          textOutline: "none",
        },
      },
    },
  },
  credits: {
    enabled: false,
  },
  series: [],
};

interface VerticalChartTypes {
  chart?: any;
  xAxis?: any;
  yAxis?: any;
  tooltip?: any;
  plotOptions?: any;
  legend?: any;
  series: any[];
}

export const VerticalChart: FC<VerticalChartTypes> = ({
  chart,
  xAxis,
  yAxis,
  series,
  tooltip,
  plotOptions,
  legend,
}) => {
  const [custom_options, setCustom_options] = useState(defaultOptionForChart);

  useEffect(() => {
    setCustom_options((options: any) => {
      return {
        ...options,
        chart: {
          ...options.chart,
          ...chart,
        },
        xAxis: {
          ...options.xAxis,
          ...xAxis,
        },
        tooltip: {
          ...options.tooltip,
          ...tooltip,
        },
        plotOptions: {
          ...options.plotOptions,
          ...plotOptions,
        },
        legend: {
          ...options.legend,
          ...legend,
        },
        yAxis: {
          ...options.yAxis,
          ...yAxis,
        },
        series,
      };
    });
  }, [series]);

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={custom_options} />
    </div>
  );
};

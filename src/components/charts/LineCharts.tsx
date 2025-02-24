import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";

const options = {
  chart: {
    type: "line",
  },
  title: null,

  subtitle: null,

  yAxis: {
    title: null,
    labels: {
      style: {
        fontSize: "12px",
        fontFamily: "Inter",
        color: "#747474",
        fontWeight: 500,
      },
    },
  },

  xAxis: {},

  legend: {
    enabled: true,
  },

  credits: {
    enabled: false,
  },

  plotOptions: {
    series: {
      lineWidth: 4,
      label: {
        connectorAllowed: false,
      },
    },
    line: {
      linecap: "round",
    },
  },

  series: [
    {
      name: "",
      data: [43934, 48656, 65165, 81827, 112143],
      color: "#4785FE",
      linecap: "round",
    },
  ],
};

export const BasicLineChart = (props: any) => {
  const [custom_options, setCustom_options] = useState(options);

  useEffect(() => {
    setCustom_options(() => {
      return {
        ...options,
        chart: {
          ...options.chart,
          ...props.chart,
        },
        xAxis: {
          ...options.xAxis,
          ...props.xAxis,
        },
        legend: {
          ...options.legend,
          ...props.legend,
        },
        yAxis: {
          ...options.yAxis,
          ...props.yAxis,
        },
        plotOptions: {
          ...options.plotOptions,
          ...props.plotOptions,
        },

        series: props.series,
      };
    });
  }, [props]);

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={custom_options} />
    </div>
  );
};

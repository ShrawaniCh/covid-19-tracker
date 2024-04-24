import Chart from "react-apexcharts";
export const LineChart = ({ options, series }) => {
  return (
    <div style={{ width: "100%" }}>
      <h6>Line Chart</h6>
      <Chart
        type="line"
        width={"100%"}
        //   height={400}
        series={series}
        options={options}
      ></Chart>
    </div>
  );
};

export const DonutChart = ({ options, series }) => {
  return (
    <div style={{ width: "100%" }}>
      <h6>DonutChart</h6>
      <Chart type="donut" width={"100%"} options={options} series={series} />
    </div>
  );
};

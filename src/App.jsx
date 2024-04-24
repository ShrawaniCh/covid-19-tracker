
import "./App.css";
import "./app.scss";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { DonutChart, LineChart } from "./Components/Chart";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [casesData, setCasesData] = useState({});
  const [recoveriesData, setRecoveriesData] = useState({});
  const [deathData, setDeathData] = useState({});
  const StatComponent = ({ heading, sub_head, stat, backgroundColor }) => {
    return (
      <div className="statComponent">
        <div className="stat_left" style={{ backgroundColor }}>
          <h4>{heading}</h4>
          <span>{sub_head}</span>
        </div>
        <div className="stat_right">{stat}</div>
      </div>
    );
  };

  function classifyIntoYears(data) {
    const years = {};

    for (const date in data) {
      const [month, day, year] = date.split("/");
      const codeCount = data[date];

      if (!years[year]) {
        years[year] = 0;
      }

      years[year] += codeCount;
    }

    return years;
  }

  function reduceAndSum(data) {
    return Object.values(data).reduce((acc, curr) => acc + curr, 0);
  }

  const getCountryList = async () => {
    try {
      const res = await axios.get("https://restcountries.com/v3.1/all");
      if (res.status == 200) {
        const data = res.data.map((cont) => cont?.name?.official);
        setCountryList(data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getCountryList();
    handleContryChange("United States of America");
  }, []);

  const handleContryChange = async (newContry) => {
    try {
      setSelectedCountry(newContry);
      const res = await axios.get(
        "https://disease.sh/v3/covid-19/historical/" +
          newContry +
          "?lastdays=1500"
      );
      if (res.status == 200) {
        setCasesData(classifyIntoYears(res.data?.timeline?.cases));
        setRecoveriesData(classifyIntoYears(res.data?.timeline?.recovered));
        setDeathData(classifyIntoYears(res.data?.timeline?.deaths));
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="App">
      {/* <h2>COVID-19 and Population dashboard</h2>
      <div className="inputHolder">
        <div className="selectHolder">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Country</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={"United States of America"}
              label="Country"
              onChange={() => {}}
            >
              <MenuItem value={"United States of America"}>
                United States of America
              </MenuItem>
              <MenuItem value={"India"}>India</MenuItem>
              <MenuItem value={"Pakistan"}>Pakistan</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="dateRangeHolder"></div>
      </div> */}
      <div className="container">
        <div className="headingHolder">
          <h2>COVID-19 and Population dashboard</h2>
        </div>
        <div className="inputholder">
          <div className="left">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Search Country
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedCountry}
                label="Search Country"
                onChange={(e) => handleContryChange(e.target.value)}
                startAdornment={<SearchIcon />}
                sx={{ borderRadius: "35px" }}
              >
                {countryList.map((cont) => (
                  <MenuItem value={cont}>{cont}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="right">
            <TextField
              label="Filter by Date Range"
              fullWidth
              value={"23-04-2022 To 23-04-2024"}
            />
          </div>
        </div>
        <div className="statHolder">
          <div className="left">
            <StatComponent
              heading={"Total Cases"}
              sub_head={"0.0002%"}
              stat={reduceAndSum(casesData)}
              backgroundColor={"#9BA5FF"}
            />
          </div>
          <div className="mid">
            <StatComponent
              heading={"Recoveries"}
              sub_head={"0.0002%"}
              stat={reduceAndSum(recoveriesData)}
              backgroundColor={"#46D728"}
            />
          </div>
          <div className="right">
            <StatComponent
              heading={"Deaths"}
              sub_head={"0.0002%"}
              stat={reduceAndSum(deathData)}
              backgroundColor={"#FF4B55"}
            />
          </div>
        </div>

        <div className="chartHolder">
          <div className="left">
            <LineChart
              options={{
                chart: {
                  height: 350,
                  type: "line",
                  zoom: {
                    enabled: true,
                  },
                  toolbar: {
                    show: false,
                  },
                },
                colors: ["#9BA5FF", "#46D728", "#FF4B55"],
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  curve: "smooth",
                },
                markers: {
                  size: 5,
                },
                grid: {
                  row: {
                    colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                    opacity: 0.5,
                  },
                },
                legend: {
                  itemMargin: {
                    horizontal: 5,
                    vertical: 30,
                  },
                },
                xaxis: {
                  categories: Object.keys(casesData),
                },
              }}
              series={[
                {
                  name: "Total Cases",
                  data: Object.values(casesData),
                },
                {
                  name: "Recoveries",
                  data: Object.values(recoveriesData),
                },
                {
                  name: "Deaths",
                  data: Object.values(deathData),
                },
              ]}
            />
          </div>
          <div className="right">
            <DonutChart
              options={{
                chart: {
                  width: 380,
                  type: "donut",
                },
                dataLabels: {
                  enabled: false,
                },
                responsive: [
                  {
                    breakpoint: 480,
                    options: {
                      chart: {
                        width: 200,
                      },
                      legend: {
                        show: false,
                      },
                    },
                  },
                ],
                colors: ["#9BA5FF", "#46D728", "#FF4B55"],
                labels: ["Cases", "Recovered", "Deaths"],

                legend: {
                  show: true,
                  position: "bottom",
                },
                plotOptions: {
                  pie: {
                    donut: {
                      labels: {
                        show: true,
                      },
                    },
                  },
                },
              }}
              series={[
                reduceAndSum(casesData),
                reduceAndSum(recoveriesData),
                reduceAndSum(deathData),
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import "./App.css";
import InfoBox from "./components/InfoBox";
import Map from "./components/Map";
import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import Table from "./components/Table";
import { sortData } from "./components/Util";
import LineGraph from "./components/LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat:34.80746,lng:-40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([])

  //fetching data for worldwide
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  //function on dropdown select for setting the contry name
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    //condition on url
    const url =
      countryCode === "WorldWide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        // All of the data ...
        // form the country response
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };
  console.log("COUNTRY INFO >>>", countryInfo);

  //country api url
  const countryUrl = "https://disease.sh/v3/covid-19/countries";

  //function for fetching the country name and value form the api
  const getCountriesData = async () => {
    await fetch(countryUrl)
      .then((response) => response.json())
      .then((data) => {
        const Countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2,
        }));
        //for the placing the highest cases at the top
        const sortedData = sortData(data);
        setTableData(sortedData);
        setCountries(Countries);
        setMapCountries(data);
      });
  };
  //useEffect handle the fetching function that is it is a side effect
  useEffect(() => {
    getCountriesData();
  }, []);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid 19 Meter</h1>
          <FormControl className="app__dropdown">
            {/* for country */}
            <Select
              varient="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {/* all countries in dropdown */}
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            title="CoronaVirus Cases"
            total={countryInfo.cases}
            cases={countryInfo.todayCases}
          />
          <InfoBox
            title="Recovered"
            total={countryInfo.recovered}
            cases={countryInfo.todayRecovered}
          />
          <InfoBox
            title="Deaths"
            total={countryInfo.deaths}
            cases={countryInfo.todayDeaths}
          />
        </div>

        <Map countries={mapCountries} center={mapCenter} zoom={mapZoom} />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>

          <Table countries={tableData} />

          <h3>Worldwide new cases</h3>
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;

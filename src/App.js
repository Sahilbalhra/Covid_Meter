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
import { sortData, prettyPrintStat } from "./components/Util";
import LineGraph from "./components/LineGraph";
import "leaflet/dist/leaflet.css";
import numeral from "numeral";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
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
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

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
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>

        <Map countries={mapCountries} casesType={casesType} center={mapCenter} zoom={mapZoom} />
      </div>

      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3>Worldwide new {casesType}</h3>
            <LineGraph />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;

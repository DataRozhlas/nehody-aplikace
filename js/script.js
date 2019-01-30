import "./targetblank"; // pro otvírání odkazů v novém okně
import React from "react";
import ReactDOM from "react-dom";
import CountUp from "react-countup";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  last, prepData, countTotal, readableDate,
} from "./helperFunctions";
import { chartOptions } from "./charts";

function App(srcData) {
  const data = prepData(srcData);
  
  const Chart = ({ chartData }) => (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions(chartData)}
      />
    </div>
  );

  const Counter = () => (
    <div className="counter">
      <div className="counter-header">
        {"Poslední den ve statistikách, "}
        <span className="last-day-readable">{readableDate(last(data).den)}</span>
        {", se událo"}
      </div>
      <div className="counter-count">
        <CountUp end={last(countTotal(data, "PN"))[1]} />
      </div>
      <div className="counter-footer">
        {"dopravních nehod."}
      </div>
    </div>
  );

  const SubCounter = ({ category }) => (
    <div className="subcounter">
      <div className="subcounter-count">
        <CountUp end={last(countTotal(data, category))[1]} />
      </div>
      <div className="subcounter-footer">
        {category === "PVA" ? "pod vlivem alkoholu"
         : category === "NPJ" ? "nedání přednosti v jízdě"
         : category === "NP" ? "nesprávné předjíždění" 
         : category === "NR" ? "nepřiměřená rychlost"
         : category === "M" ? "mrtvých"
         : category === "TR" ? "těžce raněných"
         : category === "LR" ? "lehce raněných"
         : category === "Š" ? "tisíc Kč škod"
         : "blemp"}
      </div>
    </div>
  );

  const AccidentApp = () => (
    <div>
      <Counter />
      <div className="info">
        {"Za následek měly"}
      </div>
      <div className="subcounters">
        <SubCounter category="PVA" />
        <SubCounter category="NPJ" />
        <SubCounter category="NP" />
        <SubCounter category="NR" />
      </div>
      <div className="subcounters">
        <SubCounter category="M" />
        <SubCounter category="TR" />
        <SubCounter category="LR" />
        <SubCounter category="Š" />
      </div>
      <Chart chartData={countTotal(data, "PN")} />
    </div>
  );

  ReactDOM.render(<AccidentApp />, document.getElementById("app"));
}

const request = new XMLHttpRequest();
request.open("GET", "https://data.irozhlas.cz/nehody-pcr/nehody.json", true);
request.onload = () => App(JSON.parse(request.responseText));
request.send();

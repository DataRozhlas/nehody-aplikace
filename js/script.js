import "./targetblank"; // pro otvírání odkazů v novém okně
import React from "react";
import ReactDOM from "react-dom";
import CountUp from "react-countup";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  last, prepData, countTotal, readableDate,
} from "./helperFunctions";

function App(srcData) {
  const data = prepData(srcData);

  const Chart = ({ chartData }) => {
    const options = {
      title: {
        text: "",
      },
      tooltip: {
        formatter() {
          return `<b>${readableDate(this.point.x)}</b><br>${this.point.y} nehod`;
        },
      },
      credits: {
        text: "Zdroj: Policie ČR",
        href: "https://aplikace.policie.cz/statistiky-dopravnich-nehod/Default.aspx",
      },
      xAxis: {
        type: "datetime",
        dateTimeLabelFormats: { // don't display the dummy year
          month: "%e. %m.",
          day: "%e. %m.",
          week: "%e. %m.",
        },
      },
      yAxis: {
        title: {
          text: "Počet nehod",
        },
      },
      legend: {
        enabled: false,
      },
      series: [{
        type: "column",
        data: chartData,
        name: "Počet nehod",
      }],
    };

    return (
      <div>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </div>
    );
  };

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
        {"dopravních nehod,"}
        <br />
        {"z toho"}
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
      <div className="subcounters">
        <SubCounter category="PVA" />
        <SubCounter category="NPJ" />
        <SubCounter category="NP" />
        <SubCounter category="NR" />
      </div>
      <div className="info">
        {"Za následek měly"}
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

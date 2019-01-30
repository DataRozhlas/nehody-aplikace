import "./targetblank"; // pro otvírání odkazů v novém okně
import React from "react";
import ReactDOM from "react-dom";
import CountUp from "react-countup";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  last, prepData, countTotal, readableDate, readableCategory,
} from "./helperFunctions";
import { chartOptions } from "./charts";

function App(srcData) {
  const data = prepData(srcData);
  console.log(new Date(data[0].den));

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
        <span>Poslední den ve statistikách, </span>
        <span className="last-day-readable">{readableDate(last(data).den)}</span>
        <span>, se událo</span>
      </div>
      <div className="counter-count">
        <CountUp end={last(countTotal(data, "PN"))[1]} />
      </div>
      <div className="counter-footer">dopravních nehod.</div>
    </div>
  );

  const SubCounter = ({ category }) => (
    <div className="subcounter">
      <div className="subcounter-count">
        <CountUp end={last(countTotal(data, category))[1]} />
      </div>
      <div className="subcounter-footer">
        {readableCategory(category)}
      </div>
    </div>
  );

  const Navigator = ({ day, onDayChange }) => (
    <div className="navigator">
      <span id="navPrevDay" onClick={onDayChange}>Předchozí den</span>
      <span>{` • ${day} • `}</span>
      <span id="navNextDay">Další den</span>
    </div>
  );

  class AccidentApp extends React.Component {
    constructor(props) {
      super(props);
      this.handleDayChange = this.handleDayChange.bind(this);
      this.state = { day: "2019-01-29" };
    }

    handleDayChange(day) {
      this.setState({ day: "2019-01-28" });
    }

    render() {
      const { day } = this.state;
      return (
        <div>
          <Navigator day={day} onDayChange={this.handleDayChange} />
          <Counter />
          <div className="info">Za následek měly</div>
          <div className="subcounters">
            <SubCounter category="M" />
            <SubCounter category="TR" />
            <SubCounter category="LR" />
            <SubCounter category="Š" />
          </div>
          <div className="info">Z celkového počtu nehod je důvodem:</div>
          <div className="subcounters">
            <SubCounter category="PVA" />
            <SubCounter category="NPJ" />
            <SubCounter category="NP" />
            <SubCounter category="NR" />
          </div>
          <Chart chartData={countTotal(data, "PN")} />
        </div>
      );
    }
  }

  ReactDOM.render(<AccidentApp />, document.getElementById("app"));
}

const request = new XMLHttpRequest();
request.open("GET", "https://data.irozhlas.cz/nehody-pcr/nehody.json", true);
request.onload = () => App(JSON.parse(request.responseText));
request.send();

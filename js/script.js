import "./targetblank"; // pro otvírání odkazů v novém okně
import React from "react";
import ReactDOM from "react-dom";
import CountUp from "react-countup";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  prepData, graphData, readableCategory, countDayTotals,
} from "./helperFunctions";
import { readableDate, readableWeekDay } from "./dateHelpers";
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

  const Counter = ({ count, day }) => (
    <div className="counter">
      <div className="counter-header">
        <span>{`${readableWeekDay(day)} `}</span>
        <span className="last-day-readable">{readableDate(day)}</span>
        <span> se událo</span>
      </div>
      <div className="counter-count">
        <CountUp end={count.PN} />
      </div>
      <div className="counter-footer">dopravních nehod.</div>
    </div>
  );

  const SubCounter = ({ count, category }) => (
    <div className="subcounter">
      <div className="subcounter-count">
        <CountUp end={count[category]} />
      </div>
      <div className="subcounter-footer">
        {readableCategory(category)}
      </div>
    </div>
  );

  class Navigator extends React.Component {
    constructor(props) {
      super(props);
      this.handleDaySwitch = this.handleDaySwitch.bind(this);
    }

    handleDaySwitch(e) {
      const { changeDay } = this.props;
      switch (e.target.id) {
        case "navPrevDay":
          changeDay("blop");
          break;
        default:
          changeDay("krem");
      }
    }

    render() {
      const { day } = this.props;
      return (
        <div className="navigator">
          <span id="navPrevDay" onClick={this.handleDaySwitch}>Předchozí den</span>
          <span>{` • ${readableDate(day)} • `}</span>
          <span id="navNextDay">Další den</span>
        </div>
      );
    }
  }

  // eslint-disable-next-line react/no-multi-comp
  class AccidentApp extends React.Component {
    constructor(props) {
      super(props);
      this.handleDayChange = this.handleDayChange.bind(this);
      this.state = { day: "2019-01-29" };
    }

    handleDayChange(day) {
      console.log(day);
      this.setState({ day: "2019-01-27" });
    }

    render() {
      const { day } = this.state;
      const dailyCount = countDayTotals(data.days, day);

      return (
        <div>
          <Navigator day={day} changeDay={this.handleDayChange} />
          <Counter count={dailyCount} day={day} />
          <div className="info">Za následek měly</div>
          <div className="subcounters">
            <SubCounter count={dailyCount} category="M" />
            <SubCounter count={dailyCount} category="TR" />
            <SubCounter count={dailyCount} category="LR" />
            <SubCounter count={dailyCount} category="Š" />
          </div>
          <div className="info">Z celkového počtu nehod je důvodem:</div>
          <div className="subcounters">
            <SubCounter count={dailyCount} category="PVA" />
            <SubCounter count={dailyCount} category="NPJ" />
            <SubCounter count={dailyCount} category="NP" />
            <SubCounter count={dailyCount} category="NR" />
          </div>
          {<Chart chartData={graphData(data.days, "PN")} />}
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

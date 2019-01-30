import "./targetblank"; // pro otvírání odkazů v novém okně
import React from "react";
import ReactDOM from "react-dom";
import CountUp from "react-countup";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  prepData, graphData, readableCategory, countDayTotals, countMonthTotals,
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

  const Counter = ({ count }) => (
    <div className="counter">
      <div className="counter-count">
        <CountUp end={count.PN} separator=" " />
      </div>
      <div className="counter-footer">dopravních nehod.</div>
    </div>
  );

  const SubCounter = ({ count, category }) => (
    <div className="subcounter">
      <div className="subcounter-count">
        <CountUp end={count[category]} separator=" " />
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
      const { changeDay, day } = this.props;
      let date = new Date(day);
      let monthSum = false;
      switch (e.target.id) {
        case "navPrevDay":
          if (date > new Date(data.meta.firstDay)) date.setDate(Math.max(date.getDate() - 1));
          break;
        case "navNextDay":
          if (date < new Date(data.meta.lastDay)) date.setDate(date.getDate() + 1);
          break;
        case "navLastDay":
          date = new Date(data.meta.lastDay);
          break;
        case "navFullMonth":
          monthSum = true;
          break;
        default:
          changeDay("krem");
      }
      changeDay(date.toISOString().split("T")[0], monthSum);
    }

    render() {
      return (
        <div className="navigator">
          <a id="navPrevDay" onClick={this.handleDaySwitch}>Předchozí den</a>
          <span> • </span>
          <a id="navNextDay" onClick={this.handleDaySwitch}>Následující den</a>
          <br />
          <a id="navFullMonth" onClick={this.handleDaySwitch}>Poslední měsíc</a>
          <span> • </span>
          <a id="navLastDay" onClick={this.handleDaySwitch}>Poslední den</a>
        </div>
      );
    }
  }

  // eslint-disable-next-line react/no-multi-comp
  class AccidentApp extends React.Component {
    constructor(props) {
      super(props);
      this.handleDayChange = this.handleDayChange.bind(this);
      this.state = { day: "2019-01-29", monthSum: false };
    }

    handleDayChange(day, monthSum) {
      this.setState({ day, monthSum });
    }

    render() {
      const { day, monthSum } = this.state;
      const dailyCount = monthSum ? countMonthTotals(data.days) : countDayTotals(data.days, day);
      return (
        <div>
          <Navigator day={day} changeDay={this.handleDayChange} />
          <hr />
          { monthSum 
            ? <div className="counter-header">V posledním měsíci se událo</div>
            : (
              <div className="counter-header">
                <span>{`${readableWeekDay(day)} `}</span>
                <span className="last-day-readable">{readableDate(day)}</span>
                <span> se událo</span>
              </div>
            )
          }
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

import { readableDate } from "./helperFunctions";

export const chartOptions = chartData => ({
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
});

export default { chartOptions };

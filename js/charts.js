import { readableDate } from "./dateHelpers";

export const chartOptions = chartData => ({
  title: {
    text: "Dopravní nehody v posledním měsíci",
  },
  tooltip: {
    formatter() {
      return `<b>${readableDate(this.point.x)}</b><br>${this.point.y} nehod`;
    },
  },
  chart: {
    style: {
      fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";",
    },
  },
  credits: {
    text: "Zdroj: Policie ČR",
    href: "https://aplikace.policie.cz/statistiky-dopravnich-nehod/Default.aspx",
  },
  colors: ["#d52834"],
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

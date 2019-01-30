export function last(arr) { // get last member of array
  return arr[arr.length - 1];
}

export function prepData(srcData) {
  const data = { days: {} };
  srcData.sort((a, b) => new Date(a.den) - new Date(b.den));
  srcData.forEach((el) => { data.days[el.den] = el.data; });
  data.meta = { firstDay: srcData[0].den, lastDay: last(srcData).den };
  return data;
}

export function countDayTotals(data, day) {
  const dailyData = data[day];
  const categories = ["JP", "LR", "M", "NP", "NPJ", "NR", "NZJ", "PN", "PVA", "TR", "Š"];
  const categoryCounter = {};

  categories.forEach((category) => {
    categoryCounter[category] = Object.keys(dailyData)
      .map(region => dailyData[region][category])
      .reduce((a, b) => a + b);
  });

  categoryCounter["Š"] /= 100;
  return categoryCounter;
}

export function countMonthTotals(data) {
  const categories = ["JP", "LR", "M", "NP", "NPJ", "NR", "NZJ", "PN", "PVA", "TR", "Š"];
  const categoryCounter = {};

  categories.forEach((category) => {
    categoryCounter[category] = Object.keys(data)
      .map(el => Object.keys(data[el])
        .map(subel => data[el][subel][category])
        .reduce((a, b) => a + b))
      .reduce((a, b) => a + b);
  });

  categoryCounter["Š"] /= 100;
  return categoryCounter;
}

export function readableCategory(name) {
  switch (name) {
    case "PVA":
      return "jízda pod vlivem alkoholu";
    case "NPJ":
      return "nedání přednosti v jízdě";
    case "NP":
      return "nesprávné předjíždění";
    case "NR":
      return "nepřiměřená rychlost";
    case "M":
      return "mrtvých";
    case "TR":
      return "těžce raněných";
    case "LR":
      return "lehce raněných";
    case "Š":
      return "miliónů Kč škod";
    default:
      return name;
  }
}

export function graphData(data, category) {
  return Object.keys(data)
    .map(el => [
      new Date(el).getTime(),
      Object.keys(data[el])
        .map(subel => data[el][subel][category])
        .reduce((a, b) => a + b),
    ]);
}

export default { prepData };

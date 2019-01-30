export function prepData(srcData) {
  return srcData.sort((a, b) => new Date(a.den) - new Date(b.den));
}

export function last(arr) { // get last member of array
  return arr[arr.length - 1];
}

export function newPrepData(srcData) {
  const data = {};
  srcData.sort((a, b) => new Date(a.den) - new Date(b.den));
  srcData.forEach((el) => { data[el.den] = el.data; });
  data.meta = { firstDay: srcData[0].den, lastDay: last(srcData).den };
  return data;
}

export function countDayTotals(data, day) {
  const dailyData = data[day];
  const categories = ["JP", "LR", "M", "NP", "NPJ", "NR", "NZJ", "PN", "PVA", "TR", "Š"];
  const categoryCounter = {};

  categories.forEach((category) => {
    Object.keys(dailyData).forEach((region) => {
      categoryCounter[category] = categoryCounter[category] + dailyData[region][category]
      || dailyData[region][category];
    });
  });

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
      return "tisíc Kč škod";
    default:
      return name;
  }
}

export function countDayTotal(dailyData, type) {
  let count = 0;
  Object.keys(dailyData.data).forEach((key) => {
    count += dailyData.data[key][type];
  });
  return count;
}

export function countTotal(data, category) {
  return data.map(el => [new Date(el.den).valueOf(), countDayTotal(el, category)]);
}

export default { prepData };

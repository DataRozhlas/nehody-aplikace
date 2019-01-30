export function prepData(srcData) {
  return srcData.sort((a, b) => new Date(a.den) - new Date(b.den));
}

export function last(arr) {
  return arr[arr.length - 1];
} // get last member of array

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

function getMonthName(m) {
  switch (m) {
    case 1:
      return "ledna";
    case 2:
      return "února";
    case 3:
      return "března";
    case 4:
      return "dubna";
    case 5:
      return "května";
    case 6:
      return "června";
    case 7:
      return "července";
    case 8:
      return "srpna";
    case 9:
      return "září";
    case 10:
      return "října";
    case 11:
      return "listopadu";
    case 12:
      return "prosince";
    default:
      return m;
  }
}

export function readableDate(srcDate) {
  const date = new Date(srcDate);
  return `${date.getDate()}. ${getMonthName(date.getMonth() + 1)} ${date.getFullYear()}`;
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

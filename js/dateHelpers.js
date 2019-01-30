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

export function readableWeekDay(srcDate) {
  const date = new Date(srcDate);
  const weekDay = date.getDay();

  switch (weekDay) {
    case 0:
      return "V neděli";
    case 1:
      return "V pondělí";
    case 2:
      return "V úterý";
    case 3:
      return "Ve středu";
    case 4:
      return "Ve čtvrtek";
    case 5:
      return "V pátek";
    case 6:
      return "V sobotu";
    default:
      return weekDay;
  }
}

export function readableDate(srcDate) {
  const date = new Date(srcDate);
  return `${date.getDate()}. ${getMonthName(date.getMonth() + 1)} ${date.getFullYear()}`;
}

export default { readableDate };

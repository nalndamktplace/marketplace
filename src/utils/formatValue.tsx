/* eslint-disable react-refresh/only-export-components */
import moment from "moment";

export const formatNumber = (
  number: number,
  minPrecision = 2,
  maxPrecision = 4
) => {
  const options = {
    minimumFractionDigits: minPrecision,
    maximumFractionDigits: maxPrecision,
  };
  return number.toLocaleString(undefined, options) ?? 0;
};

export const getBalanceNumber = (balance: number | string | undefined) => {
  return Number(balance);
};

export const MaxUint256 =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const sumDurations = (
  value1: any,
  unit1: any,
  value2: any,
  unit2: any
) => {
  const parseDuration = (value: any, unit: any) => {
    return moment.duration(parseInt(value), unit);
  };

  const parsedDuration1 = parseDuration(value1, unit1);
  const parsedDuration2 = parseDuration(value2, unit2);

  const totalDuration = parsedDuration1.add(parsedDuration2);
  const years = Math.floor(totalDuration.asYears());
  const months = Math.floor(totalDuration.subtract(years, "years").asMonths());
  const days = Math.floor(totalDuration.subtract(months, "months").asDays());
  const hours = Math.floor(totalDuration.subtract(days, "days").asHours());
  const minutes = Math.floor(
    totalDuration.subtract(hours, "hours").asMinutes()
  );
  const seconds = Math.floor(
    totalDuration.subtract(minutes, "minutes").asSeconds()
  );

  const string = `Total lock time: ${value1} ${unit1} + ${value2} ${unit2}  = `;
  const result = `${string} ${years > 0 ? years + " years " : ""}${
    months > 0 ? months + " months " : ""
  }${days > 0 ? days + " days " : ""}${hours > 0 ? hours + " hours " : ""}${
    minutes > 0 ? minutes + " minutes " : ""
  }${seconds > 0 ? seconds + " seconds" : ""}`;

  return result?.trim(); // Remove trailing space
};

enum PType {
  second,
  minute,
  Hour,
  Day,
  Week,
  Month,
  Year,
}

export function boostTime(value: number, type: PType): string {
  const conversionMap = {
    [PType.second]: 1,
    [PType.minute]: 60,
    [PType.Hour]: 3600,
    [PType.Day]: 86400,
    [PType.Week]: 604800,
    [PType.Month]: 2629746, // Approximate value for a month
    [PType.Year]: 31536000,
  };

  const convertedValue = value / conversionMap[type];

  return `${convertedValue} ${PType[type]}`;
}

export function youtube_parser(url: string) {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url?.match(regExp);
  return match && match[7].length == 11 ? match[7] : false;
}

export const median = (values: any) => {
  if (values.length === 0) throw new Error("No inputs");
  values.sort((a: any, b: any) => a - b);
  const half = Math?.floor(values?.length / 2);
  if (values.length % 2) return values[half];
  return (values[half - 1] + values[half]) / 2.0;
};

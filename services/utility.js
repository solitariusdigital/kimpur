export function convertNumber(number) {
  return number.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function fourGenerator() {
  return Math.floor(1000 + Math.random() * 9000);
}

export function sixGenerator() {
  return Math.floor(100000 + Math.random() * 900000);
}

export function convertDate(date) {
  return new Date(date).toLocaleDateString("fa-IR");
}

export function abbreviateNumber(num) {
  return new Intl.NumberFormat("en-GB", {
    notation: "compact",
    compactDisplay: "short",
  }).format(num);
}

export function convertFaToEn(date) {
  const persianToArabicMap = {
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
  };
  return date
    .replace(/[۰-۹]/g, (match) => persianToArabicMap[match])
    .replace(/\//g, "-");
}

export function convertPersianToGregorian(persianDate) {
  const [year, month, day] = persianDate.split("-").map(Number);
  const gregorianDate = new Date(year + 621, month - 1, day); // Rough conversion
  return gregorianDate;
}

export function getCurrentDate(isYesterday = false) {
  const now = new Date();
  if (isYesterday) {
    now.setDate(now.getDate() - 1);
  }
  const date = now.toLocaleDateString("fa-IR", {
    timeZone: "Asia/Tehran",
  });
  return date;
}

export function sortPricesByDate(prices) {
  const sortedKeys = Object.keys(prices).sort((a, b) => {
    return (
      new Date(a.replace(/-/g, "/")).getTime() -
      new Date(b.replace(/-/g, "/")).getTime()
    );
  });
  const sortedPrices = {};
  sortedKeys.forEach((key) => {
    sortedPrices[key] = prices[key];
  });
  return sortedPrices;
}

export function findPriceDates(price, isYesterday) {
  let todayDate = getCurrentDate(isYesterday);
  let value = null;
  for (const key in price) {
    if (key === convertFaToEn(todayDate)) {
      value = price[key];
      break;
    }
  }
  // If no value was found, set value to the last item in the price object
  if (price && !value) {
    const keys = Object.keys(price);
    if (keys.length > 0) {
      const lastKey = keys[keys.length - 1]; // Get the last key
      value = price[lastKey];
    } else {
      value = "-";
    }
  }
  return value ? value : "-";
}

export function calculateSevenDaysAverage(priceObject) {
  let todayDate = convertFaToEn(getCurrentDate());
  let sorted = sortPricesByDate(priceObject);
  let lastSeven;
  if (priceObject.hasOwnProperty(todayDate)) {
    lastSeven = Object.values(sorted).slice(-8, -1);
  } else {
    lastSeven = Object.values(sorted).slice(-7);
  }
  const total = lastSeven.reduce((sum, value) => sum + value, 0);
  const average = total / lastSeven.length;
  return average;
}

export function calculatePriceChange(priceObject) {
  let today = findPriceDates(priceObject, false);
  let sevenDaysAverage = "-";
  if (priceObject) {
    sevenDaysAverage = calculateSevenDaysAverage(priceObject);
  }
  const changeAmount = today - sevenDaysAverage;
  const percentageChange = ((changeAmount / sevenDaysAverage) * 100).toFixed(2);
  const direction = changeAmount > 0 ? "+" : changeAmount < 0 ? null : " ";
  if (today !== "-" && sevenDaysAverage !== "-") {
    return {
      percentageChange: percentageChange + "%",
      changeAmount: changeAmount,
      direction: direction,
    };
  } else {
    return {
      percentageChange: "-",
      changeAmount: "-",
      direction: " ",
    };
  }
}

export function toEnglishNumber(number) {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return number
    .split("")
    .map((x) => farsiDigits.indexOf(x)) // Find the index of the Farsi digit
    .join("");
}

export function isEnglishNumber(str) {
  return Boolean(str.match(/^[A-Za-z0-9]*$/));
}

export function onlyLettersAndNumbers(str) {
  return Boolean(str.match(/^[A-Za-z0-9]*$/));
}

// upload media into s3 bucket
export async function uploadMedia(
  media,
  mediaId,
  mediaFolder,
  subFolder,
  format
) {
  const file = media;
  const res = await fetch(
    `/api/upload?file=${mediaFolder}/${subFolder}/${mediaId}${format}`
  );
  const { url, fields } = await res.json();

  const formData = new FormData();
  Object.entries({ ...fields, file }).forEach(([key, value]) => {
    formData.append(key, value);
  });

  await fetch(url, {
    method: "POST",
    body: formData,
  });
}

export function replaceSpacesAndHyphens(str) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i] === " ") {
      result += "-";
    } else if (str[i] === "-") {
      result += " ";
    } else {
      result += str[i];
    }
  }
  return result;
}

export function sliceString(string, number) {
  return string.slice(0, number).split(" ").slice(0, -1).join(" ") + "...";
}

export function areAllStatesValid(states) {
  for (const state of states) {
    const values = Object.values(state);
    for (const value of values) {
      if (value === "") {
        return false;
      }
    }
  }
  return true;
}

export function validateEmail(value) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

export function extractParagraphs(text) {
  return text
    .split(/-{3,}|\n\n+/)
    .filter((paragraph) => paragraph.trim() !== "");
}


const form = document.getElementById("converterForm");
const temperatureInput = document.getElementById("temperature");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const swapButton = document.getElementById("swapUnits");
const resetButton = document.getElementById("resetButton");
const errorMessage = document.getElementById("errorMessage");
const resultPanel = document.getElementById("resultPanel");
const resultValue = document.getElementById("resultValue");
const resultDescription = document.getElementById("resultDescription");

const unitNames = {
  C: "Celsius",
  F: "Fahrenheit",
  K: "Kelvin"
};

const unitSymbols = {
  C: "°C",
  F: "°F",
  K: "K"
};

// Convert the input temperature to Celsius first.
function toCelsius(value, unit) {
  switch (unit) {
    case "C":
      return value;
    case "F":
      return (value - 32) * 5 / 9;
    case "K":
      return value - 273.15;
    default:
      throw new Error("Unsupported temperature unit.");
  }
}

// Convert Celsius to the selected target unit.
function fromCelsius(value, unit) {
  switch (unit) {
    case "C":
      return value;
    case "F":
      return (value * 9 / 5) + 32;
    case "K":
      return value + 273.15;
    default:
      throw new Error("Unsupported temperature unit.");
  }
}

function formatNumber(value) {
  if (Math.abs(value) < 0.0000001) {
    value = 0;
  }

  return Number(value.toFixed(4)).toString();
}

function showError(message) {
  errorMessage.textContent = message;
  resultPanel.hidden = true;
}

function clearError() {
  errorMessage.textContent = "";
}

function convertTemperature() {
  clearError();

  const rawValue = temperatureInput.value.trim();
  const value = Number(rawValue);
  const sourceUnit = fromUnit.value;
  const targetUnit = toUnit.value;

  if (rawValue === "" || !Number.isFinite(value)) {
    showError("Please enter a valid temperature value.");
    temperatureInput.focus();
    return false;
  }

  // Reject temperatures below absolute zero.
  const minimumValues = {
    C: -273.15,
    F: -459.67,
    K: 0
  };

  if (value < minimumValues[sourceUnit]) {
    showError(
      `Temperature cannot be below absolute zero (${minimumValues[sourceUnit]}${unitSymbols[sourceUnit]}).`
    );
    temperatureInput.focus();
    return false;
  }

  const celsiusValue = toCelsius(value, sourceUnit);
  let convertedValue = fromCelsius(celsiusValue, targetUnit);

  // Avoid tiny floating-point errors around zero.
  if (Math.abs(convertedValue) < 0.0000001) {
    convertedValue = 0;
  }

  resultValue.textContent =
    `${formatNumber(convertedValue)} ${unitSymbols[targetUnit]}`;

  resultDescription.textContent =
    `${formatNumber(value)} ${unitSymbols[sourceUnit]} = ` +
    `${formatNumber(convertedValue)} ${unitNames[targetUnit]}`;

  resultPanel.hidden = false;
  return true;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  convertTemperature();
});

swapButton.addEventListener("click", function () {
  const previousFrom = fromUnit.value;

  fromUnit.value = toUnit.value;
  toUnit.value = previousFrom;

  clearError();

  if (temperatureInput.value.trim() !== "") {
    convertTemperature();
  } else {
    resultPanel.hidden = true;
  }
});

resetButton.addEventListener("click", function () {
  form.reset();

  // Restore the default conversion: Celsius to Fahrenheit.
  fromUnit.value = "C";
  toUnit.value = "F";

  clearError();
  resultPanel.hidden = true;
  resultValue.textContent = "--";
  resultDescription.textContent = "";
  temperatureInput.focus();
});

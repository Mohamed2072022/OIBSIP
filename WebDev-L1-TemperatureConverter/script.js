
const form = document.getElementById("converterForm");
const temperatureInput = document.getElementById("temperature");
const fromUnit = document.getElementById("fromUnit");
const resetButton = document.getElementById("resetButton");

const errorMessage = document.getElementById("errorMessage");
const resultPanel = document.getElementById("resultPanel");

const celsiusResult = document.getElementById("celsiusResult");
const fahrenheitResult = document.getElementById("fahrenheitResult");
const kelvinResult = document.getElementById("kelvinResult");
const resultDescription = document.getElementById("resultDescription");

const unitSymbols = {
  C: "°C",
  F: "°F",
  K: "K"
};

const minimumValues = {
  C: -273.15,
  F: -459.67,
  K: 0
};

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

  if (rawValue === "" || !Number.isFinite(value)) {
    showError("Please enter a valid temperature value.");
    temperatureInput.focus();
    return;
  }

  if (value < minimumValues[sourceUnit]) {
    showError(
      `Temperature cannot be below absolute zero (${minimumValues[sourceUnit]}${unitSymbols[sourceUnit]}).`
    );
    temperatureInput.focus();
    return;
  }

  // Convert the input to Celsius first.
  const celsius = toCelsius(value, sourceUnit);

  // Calculate Fahrenheit and Kelvin.
  const fahrenheit = (celsius * 9 / 5) + 32;
  const kelvin = celsius + 273.15;

  // Display all three results.
  celsiusResult.textContent = `${formatNumber(celsius)} °C`;
  fahrenheitResult.textContent = `${formatNumber(fahrenheit)} °F`;
  kelvinResult.textContent = `${formatNumber(kelvin)} K`;

  resultDescription.textContent =
    `${formatNumber(value)} ${unitSymbols[sourceUnit]} converted to all temperature units.`;

  resultPanel.hidden = false;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  convertTemperature();
});

resetButton.addEventListener("click", function () {
  form.reset();

  fromUnit.value = "C";

  clearError();

  resultPanel.hidden = true;

  celsiusResult.textContent = "--";
  fahrenheitResult.textContent = "--";
  kelvinResult.textContent = "--";
  resultDescription.textContent = "";

  temperatureInput.focus();
});

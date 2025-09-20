// place.js (deferred)
// Purpose: set footer dates and compute wind chill (Celsius).

document.addEventListener("DOMContentLoaded", () => {
  // 1) Set the current year and last modified date in footer
  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const lastEl = document.getElementById("lastModified");
  if (lastEl) lastEl.textContent = document.lastModified || "Unknown";

  // 2) Static weather inputs (per assignment requirement)
  // Replace these with live API values later if desired
  const tempC = Number(document.getElementById("tempValue")?.textContent ?? 0); // Celsius
  const windKmh = Number(
    document.getElementById("windValue")?.textContent ?? 0
  ); // km/h

  // 3) Wind chill calculation (Celsius)
  // Criteria (metric): temperature <= 10°C and wind speed > 4.8 km/h
  function calculateWindChill(tempCelsius, windSpeedKmh) {
    // Canadian wind chill index (returns °C)
    // one-line return as required:
    return (
      Math.round(
        (13.12 +
          0.6215 * tempCelsius -
          11.37 * Math.pow(windSpeedKmh, 0.16) +
          0.3965 * tempCelsius * Math.pow(windSpeedKmh, 0.16)) *
          10
      ) / 10
    );
  }

  const windChillEl = document.getElementById("windChill");
  if (windChillEl) {
    if (tempC <= 10 && windKmh > 4.8) {
      const wc = calculateWindChill(tempC, windKmh);
      windChillEl.textContent = `${wc} °C`;
    } else {
      windChillEl.textContent = "N/A";
    }
  }
});

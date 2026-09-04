// Open-Meteo: free, keyless, CORS-enabled — replaces the old OpenWeatherMap
// call, which shipped a personal API key over plain HTTP and has since
// stopped working. This is a non-essential widget: failures are swallowed
// by the caller and the box just stays hidden.
const VANCOUVER = { lat: 49.2827, lon: -123.1207 };

const WEATHER_TEXT = {
  0: 'Clear sky', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Foggy',
  51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
  66: 'Freezing rain', 67: 'Freezing rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 77: 'Snow grains',
  80: 'Rain showers', 81: 'Rain showers', 82: 'Violent rain showers',
  85: 'Snow showers', 86: 'Snow showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with hail',
};

export async function loadWeather() {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${VANCOUVER.lat}&longitude=${VANCOUVER.lon}` +
    '&current=temperature_2m,weather_code&timezone=America%2FVancouver';
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather request failed (HTTP ${res.status})`);
  const data = await res.json();
  const temp = Math.round(data.current.temperature_2m);
  const description = WEATHER_TEXT[data.current.weather_code] ?? 'Current conditions';
  return `${description}, ${temp}°C in Vancouver`;
}

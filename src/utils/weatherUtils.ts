
// Utility functions for weather data

// Format temperature with units
export const formatTemp = (temp: number, units: 'metric' | 'imperial' = 'metric'): string => {
  const roundedTemp = Math.round(temp);
  return `${roundedTemp}°${units === 'metric' ? 'C' : 'F'}`;
};

// Format date from timestamp
export const formatDate = (timestamp: number, timezone: number = 0): string => {
  const date = new Date((timestamp + timezone) * 1000);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Format time from timestamp
export const formatTime = (timestamp: number, timezone: number = 0): string => {
  const date = new Date((timestamp + timezone) * 1000);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

// Group forecast data by day
export const groupForecastByDay = (list: any[]): any[] => {
  const grouped = list.reduce((acc: any, item: any) => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    
    if (!acc[date]) {
      acc[date] = [];
    }
    
    acc[date].push(item);
    return acc;
  }, {});
  
  // Get the daily average or mid-day forecast
  return Object.keys(grouped).map(date => {
    const dayData = grouped[date];
    
    // Find forecast for midday (closest to 12:00)
    const midDayForecast = dayData.reduce((closest: any, current: any) => {
      const currentHour = new Date(current.dt * 1000).getHours();
      const closestHour = closest ? new Date(closest.dt * 1000).getHours() : -1;
      
      const currentDiff = Math.abs(currentHour - 12);
      const closestDiff = Math.abs(closestHour - 12);
      
      return currentDiff < closestDiff ? current : closest;
    }, null);
    
    return midDayForecast || dayData[0]; // Fallback to first of day if no midday
  }).slice(0, 5); // Ensure we only return 5 days
};

// Map weather condition codes to weather icons
export const getWeatherIcon = (conditionCode: number): string => {
  // Map OpenWeatherMap condition codes to Lucide icon names
  // For reference: https://openweathermap.org/weather-conditions
  
  // Thunderstorm
  if (conditionCode >= 200 && conditionCode < 300) {
    return 'cloud-lightning';
  }
  
  // Drizzle
  if (conditionCode >= 300 && conditionCode < 400) {
    return 'cloud-drizzle';
  }
  
  // Rain
  if (conditionCode >= 500 && conditionCode < 600) {
    return conditionCode === 511 ? 'cloud-snow' : 'cloud-rain';
  }
  
  // Snow
  if (conditionCode >= 600 && conditionCode < 700) {
    return 'cloud-snow';
  }
  
  // Atmosphere (fog, mist, etc.)
  if (conditionCode >= 700 && conditionCode < 800) {
    return 'cloud-fog';
  }
  
  // Clear
  if (conditionCode === 800) {
    return 'sun';
  }
  
  // Clouds
  if (conditionCode > 800 && conditionCode < 900) {
    if (conditionCode === 801) return 'cloud-sun'; // few clouds
    return 'cloud';
  }
  
  // Default
  return 'cloud';
};

// Get a background gradient based on weather condition and time of day
export const getWeatherBackground = (conditionCode: number, isDay: boolean): string => {
  // Clear
  if (conditionCode === 800) {
    return isDay 
      ? 'bg-gradient-to-b from-blue-400 to-blue-600' 
      : 'bg-gradient-to-b from-indigo-900 to-blue-900';
  }
  
  // Clouds
  if (conditionCode > 800 && conditionCode < 900) {
    return isDay 
      ? 'bg-gradient-to-b from-blue-300 to-blue-500' 
      : 'bg-gradient-to-b from-gray-800 to-blue-900';
  }
  
  // Rain
  if ((conditionCode >= 300 && conditionCode < 400) || 
      (conditionCode >= 500 && conditionCode < 600)) {
    return isDay 
      ? 'bg-gradient-to-b from-gray-400 to-blue-600' 
      : 'bg-gradient-to-b from-gray-900 to-blue-800';
  }
  
  // Snow
  if (conditionCode >= 600 && conditionCode < 700) {
    return isDay 
      ? 'bg-gradient-to-b from-gray-200 to-blue-300' 
      : 'bg-gradient-to-b from-gray-800 to-blue-900';
  }
  
  // Thunderstorm
  if (conditionCode >= 200 && conditionCode < 300) {
    return 'bg-gradient-to-b from-gray-700 to-gray-900';
  }
  
  // Atmosphere (fog, mist, etc.)
  if (conditionCode >= 700 && conditionCode < 800) {
    return isDay 
      ? 'bg-gradient-to-b from-gray-300 to-gray-500' 
      : 'bg-gradient-to-b from-gray-700 to-gray-900';
  }
  
  // Default - subtle gradient
  return isDay 
    ? 'bg-gradient-to-b from-blue-200 to-blue-400' 
    : 'bg-gradient-to-b from-gray-800 to-blue-900';
};

// Check if it's daytime based on sunrise/sunset
export const isDaytime = (dt: number, sunrise: number, sunset: number): boolean => {
  return dt > sunrise && dt < sunset;
};

// Convert wind speed and get direction
export const formatWind = (speed: number, units: 'metric' | 'imperial' = 'metric'): string => {
  const unit = units === 'metric' ? 'm/s' : 'mph';
  return `${Math.round(speed)} ${unit}`;
};

// Convert timestamp to local time considering timezone offset
export const convertToLocalTime = (timestamp: number, timezone: number): Date => {
  return new Date((timestamp + timezone) * 1000);
};

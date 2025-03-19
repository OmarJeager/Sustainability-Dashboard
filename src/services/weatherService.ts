
import { toast } from "sonner";

// Types for Weather Data
export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  dt: number;
  timezone: number;
  cod: number;
}

export interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
    dt_txt: string;
  }>;
  city: {
    name: string;
    country: string;
  };
}

// API Key Management
export const saveApiKey = (apiKey: string): void => {
  localStorage.setItem('weather_api_key', apiKey);
};

export const getApiKey = (): string | null => {
  return localStorage.getItem('weather_api_key');
};

// Weather API Service
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Helper function to handle API errors
const handleApiError = (error: Error): never => {
  console.error('Weather API Error:', error);
  if (error.message.includes('401')) {
    toast.error('Invalid API key. Please check your OpenWeatherMap API key.');
  } else {
    toast.error(`Weather data error: ${error.message}`);
  }
  throw error;
};

// Get current weather by city name
export const getCurrentWeather = async (city: string, units = 'metric'): Promise<WeatherData> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    toast.error('Please enter your OpenWeatherMap API key in settings');
    throw new Error('API key is missing');
  }
  
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${apiKey}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error as Error);
  }
};

// Get 5-day forecast by city name
export const getForecast = async (city: string, units = 'metric'): Promise<ForecastData> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    toast.error('Please enter your OpenWeatherMap API key in settings');
    throw new Error('API key is missing');
  }
  
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=${units}&appid=${apiKey}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error as Error);
  }
};

// Get weather by geolocation
export const getWeatherByCoords = async (
  lat: number, 
  lon: number, 
  units = 'metric'
): Promise<WeatherData> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    toast.error('Please enter your OpenWeatherMap API key in settings');
    throw new Error('API key is missing');
  }
  
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error as Error);
  }
};

// Get forecast by geolocation
export const getForecastByCoords = async (
  lat: number, 
  lon: number, 
  units = 'metric'
): Promise<ForecastData> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    toast.error('Please enter your OpenWeatherMap API key in settings');
    throw new Error('API key is missing');
  }
  
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error as Error);
  }
};

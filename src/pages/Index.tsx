
import React, { useState, useEffect } from 'react';
import { 
  getCurrentWeather, 
  getForecast,
  getWeatherByCoords,
  getForecastByCoords,
  getApiKey,
  WeatherData,
  ForecastData
} from '@/services/weatherService';
import CurrentWeather from '@/components/CurrentWeather';
import Forecast from '@/components/Forecast';
import SearchBar from '@/components/SearchBar';
import APIKeySettings from '@/components/APIKeySettings';
import EmailSubscription from '@/components/EmailSubscription';
import { toast } from 'sonner';
import { getWeatherBackground, isDaytime } from '@/utils/weatherUtils';

const Index = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [city, setCity] = useState('London');
  
  // Load weather data on component mount
  useEffect(() => {
    const apiKey = getApiKey();
    
    if (apiKey) {
      fetchWeatherData(city);
    } else {
      // If no API key, show a notification prompting the user to set it
      setTimeout(() => {
        toast('Please set your OpenWeatherMap API key in settings', {
          action: {
            label: 'Settings',
            onClick: () => {
              // This would trigger the settings dialog
              document.querySelector<HTMLButtonElement>('[aria-label="Settings"]')?.click();
            },
          },
        });
      }, 1000);
    }
  }, []);
  
  const fetchWeatherData = async (cityName: string) => {
    if (!getApiKey()) {
      toast.error('Please set your OpenWeatherMap API key in settings');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch both current weather and forecast
      const [weatherData, forecastData] = await Promise.all([
        getCurrentWeather(cityName, units),
        getForecast(cityName, units)
      ]);
      
      setCurrentWeather(weatherData);
      setForecast(forecastData);
      setCity(cityName);
      
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (cityName: string) => {
    fetchWeatherData(cityName);
  };
  
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      toast.info('Getting your location...');
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          setLoading(true);
          setError(null);
          
          try {
            // Fetch both current weather and forecast by coordinates
            const [weatherData, forecastData] = await Promise.all([
              getWeatherByCoords(latitude, longitude, units),
              getForecastByCoords(latitude, longitude, units)
            ]);
            
            setCurrentWeather(weatherData);
            setForecast(forecastData);
            setCity(weatherData.name);
            
          } catch (err) {
            console.error('Error fetching weather data:', err);
            setError('Failed to fetch weather data. Please try again.');
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error('Geolocation error:', err);
          toast.error('Could not get your location. Please check your browser permissions.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };
  
  const toggleUnits = () => {
    const newUnits = units === 'metric' ? 'imperial' : 'metric';
    setUnits(newUnits);
    
    // Re-fetch weather data with new units if we have current weather
    if (currentWeather) {
      fetchWeatherData(city);
    }
  };
  
  // Determine background gradient based on weather and time
  const getBackgroundClass = () => {
    if (!currentWeather) return 'bg-gradient-to-b from-blue-200 to-blue-400';
    
    const isDay = isDaytime(
      currentWeather.dt, 
      currentWeather.sys.sunrise, 
      currentWeather.sys.sunset
    );
    
    return getWeatherBackground(currentWeather.weather[0].id, isDay);
  };
  
  // Determine text color based on background
  const getTextColorClass = () => {
    if (!currentWeather) return 'text-gray-900';
    
    const conditionCode = currentWeather.weather[0].id;
    const isDay = isDaytime(
      currentWeather.dt, 
      currentWeather.sys.sunrise, 
      currentWeather.sys.sunset
    );
    
    // Dark backgrounds need light text
    if (
      (!isDay && conditionCode >= 200) || // Night and most conditions
      (conditionCode >= 200 && conditionCode < 300) // Thunderstorm
    ) {
      return 'text-white';
    }
    
    return 'text-gray-900';
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ${getBackgroundClass()} ${getTextColorClass()}`}>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-baseline">
            <h1 className="text-2xl font-medium">Weather</h1>
            <button 
              onClick={toggleUnits} 
              className="ml-3 text-sm bg-white/20 hover:bg-white/30 px-2 py-1 rounded-full transition-colors duration-300"
            >
              {units === 'metric' ? '°C' : '°F'}
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <SearchBar 
              onSearch={handleSearch} 
              onGetCurrentLocation={handleGetCurrentLocation}
            />
            <APIKeySettings />
          </div>
        </header>
        
        <main className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="animate-pulse-subtle text-center">
                <div className="h-10 w-48 bg-white/20 rounded-lg mb-4 mx-auto"></div>
                <div className="h-20 w-64 bg-white/20 rounded-lg mb-4 mx-auto"></div>
                <div className="h-8 w-40 bg-white/20 rounded-lg mx-auto"></div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-lg">{error}</p>
              <button
                onClick={() => fetchWeatherData(city)}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : !currentWeather || !forecast ? (
            <div className="text-center py-10">
              <p className="text-xl">
                {getApiKey() 
                  ? 'Enter a city name to see the weather forecast'
                  : 'Please add your OpenWeatherMap API key in settings'}
              </p>
            </div>
          ) : (
            <>
              <CurrentWeather data={currentWeather} units={units} />
              <Forecast data={forecast} units={units} />
              
              {/* Add the email subscription component */}
              <div className="mt-8">
                <EmailSubscription />
              </div>
            </>
          )}
        </main>
        
        <footer className="mt-12 text-center text-sm text-white/60">
          <p>
            Data provided by{' '}
            <a 
              href="https://openweathermap.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-white/80 transition-colors"
            >
              OpenWeatherMap
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;

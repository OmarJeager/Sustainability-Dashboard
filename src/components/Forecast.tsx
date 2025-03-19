
import React from 'react';
import { ForecastData } from '@/services/weatherService';
import { formatTemp, formatDate, getWeatherIcon, groupForecastByDay } from '@/utils/weatherUtils';
import { LucideIcon } from '@/components/WeatherIcon';

interface ForecastProps {
  data: ForecastData;
  units: 'metric' | 'imperial';
  className?: string;
}

const Forecast: React.FC<ForecastProps> = ({ data, units, className = '' }) => {
  const dailyForecasts = groupForecastByDay(data.list);
  
  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-xl font-medium">5-Day Forecast</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {dailyForecasts.map((forecast, index) => {
          const date = new Date(forecast.dt * 1000);
          const icon = getWeatherIcon(forecast.weather[0].id);
          const weatherDesc = forecast.weather[0].description
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
            
          // Calculate animation delay for staggered effect
          const delay = index * 0.1;
            
          return (
            <div 
              key={index} 
              className="forecast-card animate-fade-in"
              style={{ animationDelay: `${delay}s` }}
            >
              <div className="flex flex-col items-center">
                <p className="text-sm font-medium">
                  {formatDate(forecast.dt)}
                </p>
                
                <div className="my-2">
                  <LucideIcon icon={icon} size={32} />
                </div>
                
                <p className="text-xl font-medium mb-1">
                  {formatTemp(forecast.main.temp, units)}
                </p>
                
                <p className="text-xs text-center text-muted-foreground">
                  {weatherDesc}
                </p>
                
                <div className="mt-2 pt-2 border-t border-border w-full flex justify-between text-xs text-muted-foreground">
                  <span>Hum: {forecast.main.humidity}%</span>
                  <span>Wind: {Math.round(forecast.wind.speed)}{units === 'metric' ? 'm/s' : 'mph'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Forecast;

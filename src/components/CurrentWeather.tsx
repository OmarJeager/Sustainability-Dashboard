
import React from 'react';
import { 
  Droplets, 
  Gauge, 
  Wind, 
  Sunrise, 
  Sunset,
  Cloud
} from 'lucide-react';
import { WeatherData } from '@/services/weatherService';
import { formatTemp, formatTime, getWeatherIcon, isDaytime } from '@/utils/weatherUtils';
import { LucideIcon } from '@/components/WeatherIcon';

interface CurrentWeatherProps {
  data: WeatherData;
  units: 'metric' | 'imperial';
  className?: string;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, units, className = '' }) => {
  const { 
    name, 
    main, 
    weather, 
    wind, 
    sys, 
    dt,
    timezone = 0
  } = data;
  
  const isDay = isDaytime(dt, sys.sunrise, sys.sunset);
  const icon = getWeatherIcon(weather[0].id);
  const weatherMain = weather[0].main;
  const weatherDesc = weather[0].description
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className={`weather-card animate-fade-in ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-medium">{name}</h2>
            <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {sys.country}
            </span>
          </div>
          
          <div className="flex items-center">
            <LucideIcon icon={icon} size={48} />
            <div className="pl-3">
              <p className="text-xl font-medium">{weatherMain}</p>
              <p className="text-sm text-muted-foreground">{weatherDesc}</p>
            </div>
          </div>
          
          <div className="flex items-baseline">
            <span className="text-5xl font-light tracking-tighter">
              {formatTemp(main.temp, units)}
            </span>
            <span className="text-lg text-muted-foreground ml-2">
              Feels like {formatTemp(main.feels_like, units)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <DetailItem 
            icon={<Droplets className="text-blue-500" />}
            label="Humidity"
            value={`${main.humidity}%`}
          />
          
          <DetailItem 
            icon={<Gauge className="text-green-600" />}
            label="Pressure"
            value={`${main.pressure} hPa`}
          />
          
          <DetailItem 
            icon={<Wind className="text-cyan-600" />}
            label="Wind"
            value={`${Math.round(wind.speed)} ${units === 'metric' ? 'm/s' : 'mph'}`}
          />
          
          <DetailItem 
            icon={<Sunrise className="text-amber-500" />}
            label="Sunrise"
            value={formatTime(sys.sunrise, timezone)}
          />
          
          <DetailItem 
            icon={<Sunset className="text-orange-500" />}
            label="Sunset"
            value={formatTime(sys.sunset, timezone)}
          />
          
          <DetailItem 
            icon={<Cloud className="text-slate-500" />}
            label="Updated"
            value={formatTime(dt, timezone)}
          />
        </div>
      </div>
    </div>
  );
};

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value }) => (
  <div className="flex items-center space-x-2">
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background/80">
      {icon}
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  </div>
);

export default CurrentWeather;

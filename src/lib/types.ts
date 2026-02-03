export interface AQDataPoint {
    current: number;
    unit: string;
}

export interface WeatherData {
    "pm2.5": AQDataPoint;
    pm10: AQDataPoint;
    temp: AQDataPoint;
    humid: AQDataPoint;
    wind_speed: AQDataPoint;
    wind_direct: AQDataPoint;
    rain: AQDataPoint;
}

export interface Profile {
    station_name: string;
    latitude: number;
    longitude: number;
}

export interface Meta {
    _ts: number;
}

export interface StationData {
    _profile: Profile;
    data: WeatherData;
    meta: Meta;
}

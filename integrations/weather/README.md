# Integrations - Weather Module

**Implemented:** `WeatherService.get_current_weather` and `get_forecast` use Open-Meteo. Open-Meteo does not require an API key. Historical-weather support is not implemented; callers should handle request failures and validate provider responses.

Weather integration for MAVUNO-GREEN-GRID platform.

## Overview

Integrates weather data from external services.

## Features

- Current weather data
- Weather forecasts
- Historical weather
- Severe weather alerts
- Climate analysis

## Supported Providers

- Open-Meteo
- WeatherAPI
- NOAA

## Configuration

See docs for API key setup.

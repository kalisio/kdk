# Location

## Overview

`useLocation()` provides reactive geocoder configuration and location search capabilities. It integrates with the KDK `Geocoder` and `Geolocation` services and can filter available geocoders based on the current activity project.

## Usage

```javascript
import { useLocation } from '@kalisio/kdk/map.client'

const {
  availableGeocoders, selectedGeocoders,
  setGeocoders, setViewbox,
  geolocate, search
} = useLocation()

// Configure geocoders and search
await setGeocoders([{ source: 'nominatim', selected: true }])
await setViewbox([2.2, 48.8, 2.5, 49.0])
const results = await search('Paris')
```

## Exposed

| Name | Type | Description |
|------|------|-------------|
| `availableGeocoders` | `Ref<Array>` | List of available geocoder options `[{ value, label, selected? }]` as returned by the geocoder capabilities query. |
| `selectedGeocoders` | `Ref<Array>` | List of currently selected geocoder source strings used for forward queries. |
| `setGeocoders(geocoders)` | `async Function` | Configures the available and selected geocoders. Pass `null` to clear all geocoders. Pass an empty array/object to select all available geocoders. Pass an array of `{ source, selected }` objects to filter to a specific subset. Geocoders are additionally filtered by the current activity project when applicable. |
| `setViewbox(viewbox)` | `async Function` | Sets the geographic bounding box used to bias geocoding results. Expects `[lon1, lat1, lon2, lat2]` or `null` to clear. |
| `geolocate()` | `async Function` | Triggers a browser geolocation update via the KDK `Geolocation` service. Returns the current location `{ lng, lat }` from the global store, or `undefined` if geolocation failed. |
| `search(pattern, limit?)` | `async Function` | Performs a forward geocoding query for the given text pattern using the selected geocoders and viewbox. `limit` defaults to `25`. Returns an array of geocoding result features. |

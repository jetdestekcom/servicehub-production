interface Location {
  lat: number
  lng: number
  address: string
}

interface DistanceResult {
  distance: number // in kilometers
  duration: number // in minutes
}

class MapsService {
  private apiKey: string | null = null

  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY || null
  }

  /**
   * Geocode an address to coordinates
   */
  async geocodeAddress(address: string): Promise<Location | null> {
    if (!this.apiKey) {
      console.log('Google Maps API key not configured')
      return null
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`
      )
      
      const data = await response.json()
      
      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0]
        return {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          address: result.formatted_address
        }
      }
      
      return null
    } catch (error) {
      console.error('Geocoding error:', error)
      return null
    }
  }

  /**
   * Reverse geocode coordinates to address
   */
  async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    if (!this.apiKey) {
      console.log('Google Maps API key not configured')
      return null
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`
      )
      
      const data = await response.json()
      
      if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0].formatted_address
      }
      
      return null
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      return null
    }
  }

  /**
   * Calculate distance between two points
   */
  async calculateDistance(
    origin: Location,
    destination: Location
  ): Promise<DistanceResult | null> {
    if (!this.apiKey) {
      console.log('Google Maps API key not configured')
      return null
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&key=${this.apiKey}`
      )
      
      const data = await response.json()
      
      if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
        const element = data.rows[0].elements[0]
        return {
          distance: element.distance.value / 1000, // Convert to kilometers
          duration: element.duration.value / 60 // Convert to minutes
        }
      }
      
      return null
    } catch (error) {
      console.error('Distance calculation error:', error)
      return null
    }
  }

  /**
   * Get nearby services within a radius
   */
  async getNearbyServices(
    center: Location,
    radius: number = 10 // kilometers
  ): Promise<Location[]> {
    // This would typically query your database for services within the radius
    // For now, we'll return a mock implementation
    console.log(`Getting services within ${radius}km of ${center.address}`)
    return []
  }

  /**
   * Validate if an address exists
   */
  async validateAddress(address: string): Promise<boolean> {
    const location = await this.geocodeAddress(address)
    return location !== null
  }

  /**
   * Get directions between two points
   */
  async getDirections(
    origin: Location,
    destination: Location
  ): Promise<Record<string, unknown> | null> {
    if (!this.apiKey) {
      console.log('Google Maps API key not configured')
      return null
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=${this.apiKey}`
      )
      
      const data = await response.json()
      
      if (data.status === 'OK') {
        return data
      }
      
      return null
    } catch (error) {
      console.error('Directions error:', error)
      return null
    }
  }

  /**
   * Generate a static map image
   */
  generateStaticMapUrl(
    center: Location,
    zoom: number = 13,
    size: string = '400x300',
    markers?: Location[]
  ): string {
    if (!this.apiKey) {
      return '/api/placeholder/400/300'
    }

    let url = `https://maps.googleapis.com/maps/api/staticmap?center=${center.lat},${center.lng}&zoom=${zoom}&size=${size}&key=${this.apiKey}`
    
    if (markers && markers.length > 0) {
      const markersParam = markers
        .map(marker => `markers=color:red%7C${marker.lat},${marker.lng}`)
        .join('&')
      url += `&${markersParam}`
    }
    
    return url
  }
}

export const mapsService = new MapsService()

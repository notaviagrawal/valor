// Country-specific product configurations
export const COUNTRY_PRODUCTS: Record<string, string[]> = {
  'United States': ['bananas', 'beef', 'pork'],
  'Argentina': ['apples', 'pears', 'bananas'],
  // Add more countries as needed
}

export const getProductsForCountry = (country: string): string[] => {
  return COUNTRY_PRODUCTS[country] || COUNTRY_PRODUCTS['United States']
}

export const getCountryFromLocation = (lat: number, lng: number): Promise<string> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.google || !window.google.maps) {
      resolve('United States') // Default fallback
      return
    }

    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
      if (status === 'OK' && results && results[0]) {
        const addressComponents = results[0].address_components
        const countryComponent = addressComponents.find((component: any) =>
          component.types.includes('country')
        )
        resolve(countryComponent ? countryComponent.long_name : 'United States')
      } else {
        resolve('United States') // Default fallback
      }
    })
  })
}

/**
 * Utilities for handling Cloudinary images
 *
 * Cloudinary Cloud Name: Get it from https://console.cloudinary.com/
 * Optional environment variables:
 * - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
 */

// Cloudinary configuration
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'caballerorandy'

/**
 * Generates a Cloudinary URL with transformations
 *
 * @param imageUrl - Cloudinary image public ID (e.g. "services/haircut") or full URL
 * @param options - Transformation options
 * @returns Full Cloudinary URL
 *
 * @example
 * getCloudinaryUrl('services/haircut', { width: 400, height: 300, crop: 'fill' })
 * // https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/w_400,h_300,c_fill/services/haircut
 */
export function getCloudinaryUrl(
  imageUrl: string,
  options?: {
    width?: number
    height?: number
    crop?: 'fill' | 'fit' | 'scale' | 'limit' | 'pad'
    quality?: number | 'auto'
    format?: 'auto' | 'webp' | 'jpg' | 'png'
    gravity?: 'auto' | 'face' | 'center'
    aspectRatio?: string
  }
): string {
  if (!imageUrl) {
    return '/images/placeholders/placeholder.svg'
  }

  const transformations: string[] = []

  if (options?.width) transformations.push(`w_${options.width}`)
  if (options?.height) transformations.push(`h_${options.height}`)
  if (options?.crop) transformations.push(`c_${options.crop}`)
  if (options?.quality) transformations.push(`q_${options.quality}`)
  if (options?.format) transformations.push(`f_${options.format}`)
  if (options?.gravity) transformations.push(`g_${options.gravity}`)
  if (options?.aspectRatio) transformations.push(`ar_${options.aspectRatio}`)

  const transformString = transformations.length > 0
    ? `${transformations.join(',')}/`
    : ''

  // Check if imageUrl is already a full Cloudinary URL
  const cloudinaryUrlPattern = /^https?:\/\/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(v\d+\/)?(.+)$/
  const match = imageUrl.match(cloudinaryUrlPattern)

  if (match) {
    // It's a full URL - extract cloudName, version (optional), and publicId
    const [, cloudName, version, publicId] = match
    const versionString = version || ''
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}${versionString}${publicId}`
  }

  // It's a publicId - construct the URL
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformString}${imageUrl}`
}

/**
 * Predefined URLs for common image types
 */
export const cloudinaryPresets = {
  /**
   * Service image (small square card)
   */
  serviceCard: (publicId: string) =>
    getCloudinaryUrl(publicId, {
      width: 400,
      height: 400,
      crop: 'fill',
      quality: 'auto',
      format: 'auto',
    }),

  /**
   * Service image (large hero)
   */
  serviceHero: (publicId: string) =>
    getCloudinaryUrl(publicId, {
      width: 1200,
      height: 600,
      crop: 'fill',
      quality: 'auto',
      format: 'auto',
    }),

  /**
   * Staff avatar (circular)
   */
  staffAvatar: (publicId: string) =>
    getCloudinaryUrl(publicId, {
      width: 200,
      height: 200,
      crop: 'fill',
      gravity: 'face',
      quality: 'auto',
      format: 'auto',
    }),

  /**
   * Staff card (large portrait 3:4 for staff page)
   */
  staffCard: (publicId: string) =>
    getCloudinaryUrl(publicId, {
      width: 600,
      height: 800,
      crop: 'fill',
      gravity: 'face',
      quality: 90,
      format: 'auto',
    }),

  /**
   * User avatar (circular, smaller for reviews/comments)
   */
  userAvatar: (publicId: string) =>
    getCloudinaryUrl(publicId, {
      width: 80,
      height: 80,
      crop: 'fill',
      gravity: 'face',
      quality: 'auto',
      format: 'auto',
    }),

  /**
   * Product photo
   */
  productImage: (publicId: string) =>
    getCloudinaryUrl(publicId, {
      width: 600,
      height: 600,
      crop: 'fill',
      quality: 'auto',
      format: 'auto',
    }),

  /**
   * Small thumbnail
   */
  thumbnail: (publicId: string) =>
    getCloudinaryUrl(publicId, {
      width: 150,
      height: 150,
      crop: 'fill',
      quality: 'auto',
      format: 'auto',
    }),

  /**
   * Gallery image
   */
  gallery: (publicId: string) =>
    getCloudinaryUrl(publicId, {
      width: 800,
      height: 600,
      crop: 'fill',
      quality: 'auto',
      format: 'auto',
    }),
}

/**
 * Gets the placeholder URL based on type
 */
export function getPlaceholder(type: 'service' | 'product' | 'avatar' | 'gallery'): string {
  const placeholders = {
    service: '/images/placeholders/service-placeholder.svg',
    product: '/images/placeholders/product-placeholder.svg',
    avatar: '/images/placeholders/avatar-placeholder.svg',
    gallery: '/images/placeholders/gallery-placeholder.svg',
  }

  return placeholders[type] || '/images/placeholders/placeholder.svg'
}

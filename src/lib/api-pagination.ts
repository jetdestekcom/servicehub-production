// API Pagination Security - Prevent Data Exfiltration
import { NextRequest } from 'next/server'
import { z } from 'zod'

export interface PaginationParams {
  page: number
  limit: number
  offset: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationParams
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Secure pagination schema
export const paginationSchema = z.object({
  page: z.number()
    .int('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .max(1000, 'Page cannot exceed 1000')
    .default(1),
  limit: z.number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(20),
  sort: z.string()
    .optional()
    .refine(val => !val || /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(val), 
      'Sort field must be alphanumeric'),
  order: z.enum(['asc', 'desc'])
    .optional()
    .default('desc')
})

export type PaginationInput = z.infer<typeof paginationSchema>

// Parse and validate pagination parameters
export function parsePaginationParams(req: NextRequest): PaginationInput {
  const url = new URL(req.url)
  const page = parseInt(url.searchParams.get('page') || '1', 10)
  const limit = parseInt(url.searchParams.get('limit') || '20', 10)
  const sort = url.searchParams.get('sort') || undefined
  const order = (url.searchParams.get('order') as 'asc' | 'desc') || 'desc'

  const result = paginationSchema.safeParse({ page, limit, sort, order })
  
  if (!result.success) {
    throw new Error(`Invalid pagination parameters: ${result.error.errors.map(e => e.message).join(', ')}`)
  }

  return result.data
}

// Calculate pagination metadata
export function calculatePagination(
  page: number, 
  limit: number, 
  total: number
): PaginationParams {
  const totalPages = Math.ceil(total / limit)
  const offset = (page - 1) * limit
  
  return {
    page,
    limit,
    offset,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  }
}

// Create paginated response
export function createPaginatedResponse<T>(
  data: T[],
  pagination: PaginationParams,
  total: number
): PaginatedResponse<T> {
  return {
    data,
    pagination,
    meta: {
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: pagination.totalPages
    }
  }
}

// Security: Prevent large data extraction
export function validatePaginationSecurity(
  page: number, 
  limit: number, 
  total: number
): void {
  // Maximum total records that can be accessed
  const MAX_TOTAL_RECORDS = 10000
  
  if (total > MAX_TOTAL_RECORDS) {
    throw new Error('Dataset too large for pagination. Please use filters to narrow down results.')
  }
  
  // Maximum offset to prevent deep pagination attacks
  const MAX_OFFSET = 5000
  const offset = (page - 1) * limit
  
  if (offset > MAX_OFFSET) {
    throw new Error('Page offset too large. Please use filters to narrow down results.')
  }
  
  // Prevent excessive page requests
  if (page > 100) {
    throw new Error('Page number too high. Please use filters to narrow down results.')
  }
}

// Secure sorting validation
export function validateSortField(
  sortField: string | undefined,
  allowedFields: string[]
): string | undefined {
  if (!sortField) return undefined
  
  if (!allowedFields.includes(sortField)) {
    throw new Error(`Invalid sort field. Allowed fields: ${allowedFields.join(', ')}`)
  }
  
  return sortField
}

// Rate limiting for pagination endpoints
export function getPaginationRateLimitKey(
  req: NextRequest, 
  endpoint: string
): string {
  const ip = req.ip || '127.0.0.1'
  const userId = req.headers.get('x-user-id') || 'anonymous'
  
  return `pagination:${endpoint}:${ip}:${userId}`
}

// Security headers for paginated responses
export function getPaginationSecurityHeaders(
  pagination: PaginationParams
): Record<string, string> {
  return {
    'X-Pagination-Page': pagination.page.toString(),
    'X-Pagination-Limit': pagination.limit.toString(),
    'X-Pagination-Total-Pages': pagination.totalPages.toString(),
    'X-Pagination-Has-Next': pagination.hasNextPage.toString(),
    'X-Pagination-Has-Prev': pagination.hasPrevPage.toString(),
    'Cache-Control': 'private, max-age=60',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  }
}

// Example usage in API route
export async function handlePaginatedRequest<T>(
  req: NextRequest,
  dataFetcher: (offset: number, limit: number, sort?: string, order?: string) => Promise<{ data: T[], total: number }>,
  allowedSortFields: string[] = []
): Promise<PaginatedResponse<T>> {
  try {
    // Parse and validate pagination parameters
    const { page, limit, sort, order } = parsePaginationParams(req)
    
    // Validate sort field if provided
    const validatedSort = validateSortField(sort, allowedSortFields)
    
    // Calculate pagination
    const pagination = calculatePagination(page, limit, 0) // We'll get total from dataFetcher
    
    // Fetch data
    const { data, total } = await dataFetcher(
      pagination.offset, 
      limit, 
      validatedSort, 
      order
    )
    
    // Recalculate pagination with actual total
    const finalPagination = calculatePagination(page, limit, total)
    
    // Validate security constraints
    validatePaginationSecurity(page, limit, total)
    
    // Create response
    return createPaginatedResponse(data, finalPagination, total)
    
  } catch (error) {
    throw new Error(`Pagination error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}


// Re-export types from our single source of truth
export type { Stock, Recommendation } from './polar-types';

// Extract recommendation type for convenience
export type { Stock } from './polar-types';
export type Recommendation = Stock['recommendation'];
// The single in-memory store the mock services read and mutate. Generated
// once per page load from a fixed seed, so the data is stable and coherent.
// Nothing outside src/admin/services imports this: components reach data only
// through the service interfaces + hooks.

import { generateDataset, PIPELINE_STAGES } from './generate';
import type { AdminDataset } from './generate';

export type { AdminDataset } from './generate';
export { generateDataset, PIPELINE_STAGES } from './generate';

/** Mutable in-memory database for the current session. */
export const MOCK_DB: AdminDataset = generateDataset();

export { PIPELINE_STAGES as MOCK_PIPELINE };

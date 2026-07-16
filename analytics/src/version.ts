/** Library version, stamped onto every event envelope for debuggability. */
export const LIBRARY_VERSION = '1.0.0';

/**
 * Bump when the shape/meaning of stored consent changes in a way that should
 * re-prompt the user. Stored consent with a different version is treated as unset.
 */
export const CONSENT_SCHEMA_VERSION = 1;

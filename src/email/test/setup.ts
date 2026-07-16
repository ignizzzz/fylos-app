// Registers @testing-library/jest-dom matchers with Vitest's `expect` and
// augments the vitest Assertion types. Kept inside src/email so the type
// augmentation lands in the tsconfig.email program (include: ["src/email"]).
import '@testing-library/jest-dom/vitest'

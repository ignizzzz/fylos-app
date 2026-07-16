import { type Article } from '../types.ts'
import { article as healthRecordThatTravels } from './health-record-that-travels.ts'
import { article as vaccineScheduleBasics } from './vaccine-schedule-basics.ts'
import { article as buildingAWalkRoutine } from './building-a-walk-routine.ts'
import { article as ifYourPetGoesMissing } from './if-your-pet-goes-missing.ts'
import { article as firstVetVisit } from './first-vet-visit.ts'

/**
 * The article set. To add an article, create a file next to this one that
 * exports an `article: Article`, then register it here. A backend or CMS would
 * replace this array with a fetch that returns the same shape.
 */
export const articles: Article[] = [
  healthRecordThatTravels,
  vaccineScheduleBasics,
  buildingAWalkRoutine,
  ifYourPetGoesMissing,
  firstVetVisit,
]

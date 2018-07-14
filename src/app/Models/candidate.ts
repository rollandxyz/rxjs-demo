import { Extent } from './extent';
import { Attributes } from './attributes';

export class Candidate {
    address: string;
    location: Location;
    score: number;
   attributes: Attributes;
   extent: Extent;
}

export class UseCase {
  _id: string;
  project: string; //ObjectID of the project TODO This shouldn't be here? The _id is the object ID?
  title: string;
  goal: string;
  scope: string;
  level: string;
  preconditions: Array<string>;
  successEndCondition: string;
  failedEndCondition: string;
  primaryActor: string;
  secondaryActors: Array<string>;
  trigger: string;
  description: Array<string>;
  extensions: Array<string>;
  subVariations: Array<string>;
}

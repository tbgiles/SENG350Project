export class UseCase {
  _id: string;
  project: string; //ObjectID of the project TODO This shouldn't be here? The _id is the object ID?
  title: string;
  goal: string;
  scope: string;
  level: string;
  preconditions: string;
  successEndCondition: string;
  failedEndCondition: string;
  primaryActor: string;
  secondaryActors: string;
  trigger: string;
  description: string;
  extensions: string;
  subVariations: string;
}

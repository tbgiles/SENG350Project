export class UseCase {
  _id: string;
  project: string; //ObjectID of the project
  title: string;
  goal: string;
  scope: string;
  level: string;
  preconditions: string;
  successEndCondition: string;
  failedEndCondition: string;t
  primaryActor: string;
  secondaryActors: string;
  trigger: string;
  description: string;
  extensions: string;
  subVariations: string;
}

export class UseCase {
  _id: string;
  project: string; //ObjectID of the project
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

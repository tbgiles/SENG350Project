export class Project {
  _id: string;
  title: string;
  users: Array<Object>;
  useCases: Array<string>; // Array of ObjectID's
}

/*

example structure:

{
  _id: "32a8f9ec720d9a81950a2cca",
  title: "testProject",
  users: [
    {
      _id: "32a8f9ec720d9a81950a2f33s",
      permission: "read"
    }, {
      id: "32a8f9ec720d9a81950a2d84",
      permission: "owner"
    }
  ],
  useCases: [
    "32a8f9ec720d9a81950a2673",
    "32a8f9ec720d9a81950a220a"
  ]
}

*/

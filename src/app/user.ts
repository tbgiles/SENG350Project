export class User {
  _id: string; // MongoDB ObjectID for the user
  name: string;
  role: string;
  projects: Array<Object>;
}

/*

example structure:

{
  _id: "32a8f9ec720d9a81950a2d9f",
  name: "admin",
  role: "admin",
  projects: [
    {
      _id: "32a8f9ec720d9a81950a3829",
      permission: "read"
    },
    {
      _id: "32a8f9ec720d9a81950a642a",
      permission: "owner"
    }
  ]
}

*/

# onboard-daniel-martins
## Basic server development as a method of introducing company standards
Getting acquainted with basic server development (CRUD data in a db), utilizing git in a professional environment, and ultimately prepare the server for usage in conjunction with an application developed in a separate onboarding project. 
This is an onboarding project with the overarching goals of getting used to our technology stack, patterns and best practices, such as Vincent Driessen's branching model, rebasing as a core principle of organizing version control and other company conventions. 

## Environment and tools *

## Steps to run and debug 
# Getting the server up:
- Typing the command "npm run dev" on the terminal at the project directory will get the server running at http://localhost:3000/ (Apollo Studio)
- The command "npm run generate" executed under the same conditions will regenerate the schema.graphql and nexus-typegen.ts files created by nexus in case of types not getting updated properly
# Valid queries:
- A query with a hello field, in the format displayed below, shall return a "Hello World!" from the server

```
query ExampleQuery {
  hello
}
```
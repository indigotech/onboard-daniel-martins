# onboard-daniel-martins
## Basic server development as a method of introducing company standards
Getting acquainted with basic server development (CRUD data in a db) and ultimately prepare the server for usage in conjunction with an application developed in a separate onboarding project. 
This is an onboarding project with the overarching goals of getting used to our technology stack, patterns and best practices, such as Vincent Driessen's branching model, rebasing as a core principle of organizing version control and other company conventions. 

## Environment and tools 
- Apollo Server v3.10.2
- Docker v4.12.0 was used for managing local and test database environments using containers.
- GraphQL v16.6.0 
- Node v14.12.0
- Typescript v4.8.2
- TypeORM v0.3.9

## Steps to run and debug
### Installing necessary dependencies:
- Type "npm install" to get all dependencies needed to run the server from the package.json.

### Getting the server up:
- Typing the command "npm run start" on the terminal at the project directory will get the server running at http://localhost:3000/ (Apollo Studio) by executing server.ts through ts-node.
- Alternatively, typing "npm run build" will compile server.ts into its JS equivalent, allowing the usage of "node server.js" instead.

### Editing the local and test databases:
- Both databases are initially created through Docker containers, defined in docker-compose.yml. Editing the file allows you to set the superuser username and password, as well as changing database names.
- To create both databases, type the command "docker-compose up -d" on the project root with Docker running on your computer.
- After they've been created, you can edit them with ease through either code with TypeORM or some database editing software (TablePlus, PopSQL).
- Adding new queries is as simple as adding the new query fields under the "server.ts" constant "typeDefs" and their respective resolver functions under "resolvers" in the same file, following typical GraphQL formatting.

# Kicksmarter

The released website can be access on https://kicksmarter-hackathon-frontend-dud4.vercel.app/, which was published from the `frontend` folder. To access the Web API alone one can visit https://kicksmarter-api-dev.onrender.com/graphql, which was published from the `backend` folder. Each of the folders have their own README files for more in-depth explanations on how they function and how to run them.

The hackathon video presentation can be found on [Youtube](https://www.youtube.com/watch?v=uIckvTeI7WE).

## Architecture

To understand the setup it is useful to know the architecture and the tech stack used:

![Architecture and Tech Stack](architecture.png)

## Running

The project uses npm workspaces, to run the app do:

```
npm run dev:all # both backend and frontend
npm run dev:backend # only backend
npm run dev:frontend # only frontend
```

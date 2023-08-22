
# Giant Stride Backend

Backend API for [giant-stride-frontend](https://github.com/haniframadhani/giant-stride-frontend)


## Tech Stack

**Client:** Next js,  TailwindCSS

**Server:** Node js, Express

**Database:** MongoDb

## Installation

clone with git

```git
git clone https://github.com/haniframadhani/giant-stride-backend.git
```

Install giant-stride-backend with npm

```bash
  npm install 
```
    
## Run Locally

Clone the project

```bash
  git clone https://github.com/haniframadhani/giant-stride-backend.git
```

Go to the project directory

```bash
  cd giant-stride-backend
```

Install dependencies

```bash
  npm install
```

Install nodemon globally

```bash
npm install -g nodemon
```

Start the development server

```bash
  npm run dev
```

Start the non-development server

```bash
  npm run start
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT` optional, default value is 4000

`ACCESS_TOKEN_SECRET` 32 character long or more, only number and character (uppercase and lower case) E.g  `8UzcKvJUi7aoxcMnF1we34uCJsG59vUC`

`REFRESH_TOKEN_SECRET` 32 character long or more, only number and character (uppercase and lower case) E.g `8UzcKvJUi7aoxcMnF1we34uCJsG59vUC`

`ALLOW_ORIGIN` your frontend url E.g http://localhost:3000

`DATABASE_URL` your database url E.g mongodb://127.0.0.1:27017/mydatabase

`SECURE_COOKIE` not required in development. must set to `false` for development don't leave empty, leave empty will set `true` by default.

## FAQ

#### What is the different between development server and non-development server?

development server run with nodemon, non-development server run without nodemon


## Frontend

Frontend repo

[giant-stride-frontend](https://github.com/haniframadhani/giant-stride-frontend)


## Authors

- [@haniframadhani](https://github.com/haniframadhani)


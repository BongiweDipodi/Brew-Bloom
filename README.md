sudo systemctl stop postgresqlsudo systemctl stop postgresql# Brew & Bloom

Brew & Bloom is a small cafe game for the browser. Customers walk in and order a drink, you make it by tapping the brewing steps in the right order, and you earn coins and reputation. Spend the coins in the upgrade shop to grow your cafe, and watch your reputation level unlock new drinks.

It is a full stack project with a React front end, an Express API, and a PostgreSQL database managed with Prisma. Progress is saved on the server, so you can close the tab and come back to the same cafe.

## How the game works

Each customer arrives with a patience bar. You tap the steps of their drink in order before the bar runs out. Fewer mistakes earn more stars, and a fast brew earns a tip. If the customer runs out of patience they leave and your reputation drops by one.

Coins buy upgrades such as a better kettle, an extra table that makes customers wait longer, and pink wallpaper for the cafe. Reputation sets your level, and some upgrades only appear once you reach a certain level. The espresso machine and the filter coffee set add new drinks to the menu, so later customers order more varied and better paid drinks.

## Tech stack

The client uses React 19 and Vite. The server uses Node, Express 5, and Prisma 6 with PostgreSQL. Prisma is pinned to version 6 because newer major versions changed how the database connection is configured. The unit tests use the test runner that ships with Node, so there is nothing extra to install.

## Getting started

You need Node 20 or newer and Docker for the database. Start from the project root.

Start PostgreSQL:

```bash
docker compose up -d
```

Set up and start the server:

```bash
cd server
cp .env.example .env
npm install
npm run db:migrate
npm run dev
```

In a second terminal, start the client:

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173, enter your name, and open the cafe. The Vite dev server forwards requests that start with /api to the Express server on port 4000, so there is no extra CORS setup during development.

## Project structure

```
brew-and-bloom/
  docker-compose.yml        local PostgreSQL
  client/
    src/
      App.jsx               game screen, state and API calls
      api.js                small fetch helpers for the server
      components/
        TapBrew.jsx         the tap-the-steps mini game
        Customer.jsx        customer, order and patience bar
        Hud.jsx             coins, level and progress
        Shop.jsx            upgrade shop
        Welcome.jsx         first screen
      game/recipes.js       drink steps and customer list
      styles.css
  server/
    prisma/schema.prisma    Player and PlayerUpgrade tables
    src/
      index.js              Express setup
      routes/game.js        API routes
      game/
        recipes.js          prices and unlock rules
        upgrades.js         the upgrade catalogue
        rewards.js          coins, stars and level rules
        rewards.test.js     unit tests
```

## API

All routes live under /api. A player is identified by the id returned when the player is created, which the client keeps in local storage.

```
GET   /upgrades                     the upgrade catalogue
POST  /players                      create a player, body: { name }
GET   /players/:id                  current game state
POST  /players/:id/serve            body: { recipeId, mistakes, timeMs }
POST  /players/:id/walkout          a customer left, lowers reputation
POST  /players/:id/upgrades         buy an upgrade, body: { key }
```

Every route that changes progress returns the full updated game state, so the client always draws what the server says is true.

## Where the rules live

The server decides rewards, levels, and whether a purchase is allowed. The functions in server/src/game/rewards.js are plain functions with no database or HTTP code, which is why they have their own tests. Run them with:

```bash
cd server
npm test
```

To add a drink, add its steps to client/src/game/recipes.js and its price to server/src/game/recipes.js using the same id. To add an upgrade, add an entry to server/src/game/upgrades.js. No database change is needed for either.

## License

Copyright (c) 2026 [Your full name]. All rights reserved. The code is public so it can be viewed and reviewed, but it may not be copied, modified, distributed, or used without written permission. See the LICENSE file for the full text.

## Known limitations

There is no login yet. A player is just an id stored in the browser, so clearing site data means starting a new cafe. The client reports its own mistakes and brew time, so a determined player could send fake numbers. That is fine for a first version, and the server already checks the recipe, the unlock rules, and the coin balance on every purchase.

## Ideas for next steps

Good next features are a proper login with hashed passwords, a hidden recipe ticket for higher levels so players must learn the steps, daily quests, a weekly leaderboard of the most popular cafes, and more upgrades with visible changes to the cafe. Deploying the client and server as two separate services, with the API address set through an environment variable, would make a nice finishing step.
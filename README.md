# Udacity Captose Project - A Travel Planner

The user is asked to submit

* A destination city
* Departure date

Through 3 APIs, they will then receive trip and weather information as well as an image of what they can expect to see in the city.

## Getting started

After forking this repo, start by installing everything from your Terminal:

`cd` into your new folder and run:
- `npm install`

## Setting up the APIs

Sign up to these 3 APIs:

[Weatherbit] https://www.weatherbit.io/
[Geonames] http://www.geonames.org/
[Pixabay] https://pixabay.com/

Create an .env file in the root with your API keys with the following format:
```
WEATHERBIT_API_KEY=
GEONAMES_USERNAME=
PIXABAY_KEY=
```

## Create dist folder and spin up server

```
npm run build-prod
npm run start
```

Finally, open localhost:8000 on your browser and you should be able to make a successful submission.

## Ways to stand out

- Save trip information by hitting the Save trip button. A new div is revealed below.
- When looking up obscure locations, an image from the country is included instead.
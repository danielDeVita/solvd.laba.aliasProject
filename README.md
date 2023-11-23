# Alias game
This repository contains the final project for SOLVD's Node.js development course.

## Table of Contents

 - [Task](#Task)
	 - [Game Description](#game-description)
		 - [Objective](#objective)
		 - [Turns](#turns)
		 - [Scoring](#scoring)
		 - [End Game](#end-game)
	- [System Requirements](#system-requirements)
	- [Setup and Authentication](#setup-and-authentication)
		- [Database setup](#database-setup)
	- [Database Schema](#database-schema)
		- [User](#user)
		- [Chat](#chat)
		- Game
			- [Players guessing the word](#game-players-guessing-the-word)
			- [Player trying to explain the word](#game-player-trying-to-explain-the-word)
-  ~~[API Endpoints](#api-endpoints)~~
- ~~[Security  and Authentication](#security-and-authentication)~~
- ~~[Testing](#testing)~~
- ~~[Deployment](#deployment)~~
- ~~[Future Enhancements](#future-enhancements)~~
- ~~[FAQ](#faq)~~
- ~~[Conclusion](#Conclusion)~~

---

## Task

Develop the Alias game, a multiplayer game built with Node.js. It includes chat functionality and a feature to check for similar words.  
  
### Game Description  
Alias is a word-guessing game where players form teams. Each team takes turns where one member describes a word and others guess it. The game includes a chat for players to communicate and a system to check for similar words.  
  
#### Objective  
Teams try to guess as many words as possible from their teammates' descriptions.  
  
#### Turns  
Each turn is timed. Describers cannot use the word or its derivatives.  
  
#### Scoring  
Points are awarded for each correct guess. Similar words are checked for validation.  
  
#### End Game  
The game concludes after a predetermined number of rounds, with the highest-scoring team winning.  
  
## System Requirements  
- **Backend**: Node.js  
- **Database**: CouchDB  
  
## Setup and Installation    
To install the project you must follow these steps:
1. [Install Node.js](https://nodejs.org/en/download)
2. Clone this repository by running `git clone https://github.com/danielDeVita/solvd.laba.aliasProject.git` wherever you want to store the repository
3. Run `npm install` inside the repository directory to install all project dependencies.
4. To run the app locally run `npm start`

### Database setup
To setup and run the database you must follow these steps:
1. [Install Docker](https://docs.docker.com/get-docker/)
2. Make sure the Docker Daemon is running. You can check this using the `docker info` command. 
3. Run `docker compose up -d` inside the repository directory to build the database docker container
4. You can now access the database user interface [here](http://localhost:5984/_utils/)
     
## Database Schema

### User

##### Posting into server

```
// Example

{
  "id": "mySuperUsername",
  "email": "aliasProPlayer@gmail.com",
  "password": "mySecretPassword",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user" | "admin" | "inactive"
}
```

##### Getting from server

```
// Example

{
  "id": "mySuperUsername",
  "email": "aliasProPlayer@gmail.com",
  "salt": "*",              // hidden value
  "hashedPassword": "*",    // hidden value
  "firstName": "John",
  "lastName": "Doe",
  "role": "user" | "admin" | "inactive",
  "createdAt": "2011-10-05T14:48:00.000Z",
  "updatedAt: "2011-10-05T15:42:00.000Z"
}

```

#### Properties description

- **id**: used for user authentication and display name

  `{ type: 'string', minLength: 6, maxLength: 16}`

- **email**: user email

  `{ type: 'email', minLength: 6}`

- **password**: used for user authentication

  `{ type: 'email', minLength: 8, maxLength: 32 }`

- **salt**: used for a extra layer of security for storing password

  `{ type: 'string', length: 32 }`

- **hashedPassword**: used for a extra layer of security for storing password

  `{ type: 'string', length: 64 }`

- **firstName**: user first name

  `{ type: 'string', minLength: 1}`

- **lastName**: user last name

  `{ type: 'string', minLength: 1}`

- **role**: the user role

  `{ type: 'string', enum: ['user', 'admin', 'inactive']}`

- **createdAt**: user creation date

  `{ type: Date, format:  ISO 8601 }`

- **updatedAt**: user update date

  `{ type: Date, format:  ISO 8601 }`

### Chat

##### Posting into server

```
// Example

{
    "message": "it is used for preparing a hot infusion you drink with a straw"
}
```

##### Getting from server

```
// Example

{
    "message": "you use it to not be harmed by the sun",
    "roomId": "4d4617ac-b35f-4a80-ac55-c16d1d7992a1",
    "createdBy": "theSuperUser2341",
    "createdAt": "2011-10-05T15:42:00.000Z"
}
```

#### Properties description

- **message**: message sent by a user

  `{ type: string, minLength: 1 }`

- **roomId**: room id of the match

  `{ type: string, length: 36 }`

- **createdBy**: the user id of the message creator

  `{ type: string, length: 36 }`

- **createdAt**: the message creation date

  `{ type: Date, format:  ISO 8601 }`

### Game: players guessing the word

##### Posting into server

```
// Example

{
    "word": "tea"
}
```

##### Getting from server

```
// Example

{
    "isCorrectWord": true | false
}
```

#### Properties description

- **word**: guessed word from players

  `{ type: string, format: mingLength: 1 }`

- **isCorrectWord**: result of the the guessed word. "true" the word has been guessed, "false" if not.

  `{ type: boolean, enum: [true, false]}`

### Game: player trying to explain the word

##### Get from server

```
// Example

{
    "word": "laptop"
}
```

##### Properties description

- **word**: word to explain to the other players

  `{ type: string, format: mingLength: 1 }`  

## API Endpoints

## Security  and Authentication

  
## Testing  
  
  
## Deployment  

  
## Future Enhancements  
  
  
## FAQ  

  
## Conclusion  
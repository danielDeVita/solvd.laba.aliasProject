## API Schemas

### User

#### Posting into server

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

#### Getting from server

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

### Properties description

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

## Chat

### Posting into server

```
// Example

{
    "message": "it is used for preparing a hot infusion you drink with a straw"
}
```

### Getting from server

```
// Example

{
    "message": "you use it to not be harmed by the sun",
    "roomId": "4d4617ac-b35f-4a80-ac55-c16d1d7992a1",
    "createdBy": "theSuperUser2341",
    "createdAt": "2011-10-05T15:42:00.000Z"
}
```

### Properties description

- **message**: message sent by a user

  `{ type: string, minLength: 1 }`

- **roomId**: room id of the match

  `{ type: string, length: 36 }`

- **createdBy**: the user id of the message creator

  `{ type: string, length: 36 }`

- **createdAt**: the message creation date

  `{ type: Date, format:  ISO 8601 }`

## Game: players guessing the word

### Posting into server

```
// Example

{
    "word": "tea"
}
```

### Getting from server

```
// Example

{
    "isCorrectWord": true | false
}
```

### Properties description

- **word**: guessed word from players

  `{ type: string, format: mingLength: 1 }`

- **isCorrectWord**: result of the the guessed word. "true" the word has been guessed, "false" if not.

  `{ type: boolean, enum: [true, false]}`

## Game: player trying to explain the word

### Get from server

```
// Example

{
    "word": "laptop"
}
```

### Properties description

- **word**: word to explain to the other players

  `{ type: string, format: mingLength: 1 }`

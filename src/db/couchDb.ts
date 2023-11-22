import Nano from "nano";

const couchdbUrl = `${process.env.COUCH_DB_URL}`

const couch = Nano(couchdbUrl);

const databases = {
  users: createDatabase("users"),
  //artemDB: createDatabase('artemDB'),
};

function createDatabase(dbName: string) {
  //create db if it doesn't exist
  couch.db.create(dbName);
  //or get a reference to the database if exists
  return couch.use(dbName);
}

export { databases }; //in other file this would be database.user.create for example

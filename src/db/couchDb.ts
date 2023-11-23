import Nano from 'nano';
import 'dotenv/config';

//I can't get my process.env.COUCH_URL file to work for some reason!
const couchdbUrl =
  process.env.COUCH_DB_URL || 'http://admin:1235813@localhost:5984';

const couch = Nano(couchdbUrl);

const databases = {
  users: createDatabase('users'),
  gameRoom: createDatabase('gameroom'),
  //artemDB: createDatabase('artemDB'),
};

async function createDatabase(dbName: string) {
  const dbExists = await couch.db.get(dbName).catch((err) => {
    if (err.statusCode === 404) {
      return false;
    } else {
      throw err;
    }
  });

  if (!dbExists) {
    //creates database if it doesn't exist
    await couch.db.create(dbName);
  }
  //get a reference to the database if exists
  return couch.use(dbName);
}

export { databases }; //in other file this would be database.user.create for example

import { MongoClient } from "mongodb";

const fallbackUri = "mongodb+srv://smulla44447_db_user:Magna%40786@cluster0.nx1yqot.mongodb.net/feedback-system?retryWrites=true&w=majority&appName=Cluster0";
const uri = process.env.MONGO_URL || process.env.MONGODB_URI || fallbackUri;
const options = {};

let client;
let clientPromise;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
} else {
  clientPromise = Promise.resolve(null);
}

export default clientPromise;
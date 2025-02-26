import { RxDatabase } from 'rxdb';
import { replicateMongoDB } from '@rxdb/plugins/replication-mongodb';

const MONGO_DB_URL = 'mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname';

export const syncDatabase = (db) => {
    replicateMongoDB({
        collection: db.businesses,
        replicationIdentifier: 'business-sync',
        databaseURL: MONGO_DB_URL,
        pull: {},
        push: {},
        live: true, 
        retryTime: 5000
    });

    replicateMongoDB({
        collection: db.articles,
        replicationIdentifier: 'article-sync',
        databaseURL: MONGO_DB_URL,
        pull: {},
        push: {},
        live: true,
        retryTime: 5000
    });

    console.log('Database sync initialized.');
};

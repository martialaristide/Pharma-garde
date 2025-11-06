import type { Knex } from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM-compatible way to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Update these paths to correctly point to your project's root
const BASE_PATH = path.join(__dirname);

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.join(BASE_PATH, 'pharma_garde.db')
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(BASE_PATH, 'db/migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'db/seeds')
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};

export default config;
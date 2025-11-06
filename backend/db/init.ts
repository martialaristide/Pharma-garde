import knex from 'knex';
import config from '../knexfile';
import bcrypt from 'bcryptjs';

const db = knex(config.development);

async function initializeDatabase() {
  console.log('Starting database initialization...');

  try {
    // Drop tables if they exist to start fresh
    await db.schema.dropTableIfExists('reviews');
    await db.schema.dropTableIfExists('push_subscriptions');
    await db.schema.dropTableIfExists('establishments');
    await db.schema.dropTableIfExists('users');
    console.log('Dropped existing tables.');

    // Create users table
    await db.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.string('membership').defaultTo('free');
      table.timestamps(true, true);
    });
    console.log('Created "users" table.');

    // Create establishments table
    await db.schema.createTable('establishments', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('type').notNullable(); // 'pharmacy', 'hospital', 'healthCenter'
      table.string('address').notNullable();
      table.decimal('lat', 9, 6).notNullable();
      table.decimal('lon', 9, 6).notNullable();
      table.string('phone').notNullable();
      table.json('hours').notNullable(); // { "mon": "08:00-20:00", ... }
      table.boolean('onDuty').defaultTo(false);
      table.boolean('open24h').defaultTo(false);
      table.string('photoUrl');
    });
    console.log('Created "establishments" table.');

    // Create reviews table
    await db.schema.createTable('reviews', (table) => {
        table.increments('id').primary();
        table.integer('establishmentId').unsigned().references('id').inTable('establishments').onDelete('CASCADE');
        table.integer('userId').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.string('userName').notNullable();
        table.integer('rating').notNullable();
        table.text('comment');
        table.timestamps(true, true);
    });
    console.log('Created "reviews" table.');

    // Create push_subscriptions table
    await db.schema.createTable('push_subscriptions', (table) => {
        table.increments('id').primary();
        table.string('endpoint').notNullable().unique();
        table.string('p256dh').notNullable();
        table.string('auth').notNullable();
        table.timestamps(true, true);
    });
    console.log('Created "push_subscriptions" table.');


    // Seed data
    const hashedPassword = await bcrypt.hash('password123', 10);
    const [userId] = await db('users').insert({
      name: 'Alice',
      email: 'alice@example.com',
      password: hashedPassword,
      membership: 'free'
    }).returning('id');
     const [premiumUserId] = await db('users').insert({
      name: 'Bob Premium',
      email: 'bob@example.com',
      password: hashedPassword,
      membership: 'premium'
    }).returning('id');

    console.log('Seeded users.');

    await db('establishments').insert([
        { id: 1, name: 'Pharmacie du Progrès', type: 'pharmacy', address: '123 Rue de la République, Douala', lat: 4.0483, lon: 9.7043, phone: '+237 233 45 67 89', hours: JSON.stringify({ "Lundi-Samedi": "08:00 - 20:00", "Dimanche": "Fermé" }), onDuty: true, open24h: false, photoUrl: 'https://images.unsplash.com/photo-1585435557343-3c90272c63c9?q=80&w=1974&auto=format&fit=crop' },
        { id: 2, name: 'Hôpital Laquintinie', type: 'hospital', address: 'Avenue De Gaulle, Douala', lat: 4.0448, lon: 9.6935, phone: '+237 233 50 12 12', hours: JSON.stringify({ "Tous les jours": "24h/24" }), onDuty: true, open24h: true, photoUrl: 'https://images.unsplash.com/photo-1629904853716-f0bc54eea481?q=80&w=2070&auto=format&fit=crop' },
        { id: 3, name: 'Centre Médical de la Cité', type: 'healthCenter', address: 'Rue des Palmiers, Yaoundé', lat: 3.8480, lon: 11.5021, phone: '+237 222 22 33 44', hours: JSON.stringify({ "Lundi-Vendredi": "07:30 - 18:00", "Samedi": "08:00 - 12:00" }), onDuty: false, open24h: false, photoUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2128&auto=format&fit=crop' },
        { id: 4, name: 'Pharmacie de la Liberté', type: 'pharmacy', address: 'Boulevard de la Liberté, Douala', lat: 4.0511, lon: 9.7115, phone: '+237 233 98 76 54', hours: JSON.stringify({ "Lundi-Samedi": "08:00 - 21:00", "Dimanche": "09:00 - 13:00" }), onDuty: false, open24h: false, photoUrl: 'https://images.unsplash.com/photo-1605658144498-651d2f974757?q=80&w=2070&auto=format&fit=crop' },
        { id: 5, name: 'Pharmacie des Acacias', type: 'pharmacy', address: 'Rond Point Deido, Douala', lat: 4.0600, lon: 9.7200, phone: '+237 233 11 22 33', hours: JSON.stringify({ "Tous les jours": "24h/24" }), onDuty: false, open24h: true, photoUrl: 'https://images.unsplash.com/photo-1576683567232-a32863a44315?q=80&w=1974&auto=format&fit=crop' },
    ]);
    console.log('Seeded establishments.');

    await db('reviews').insert([
        { establishmentId: 1, userId: (userId as any).id || userId, userName: 'Alice', rating: 5, comment: 'Service impeccable et personnel très compétent. Toujours de bon conseil.' },
        { establishmentId: 1, userId: (premiumUserId as any).id || premiumUserId, userName: 'Bob Premium', rating: 4, comment: 'Très bonne pharmacie, un peu d\'attente aux heures de pointe.' },
        { establishmentId: 2, userId: (userId as any).id || userId, userName: 'Alice', rating: 3, comment: 'Les urgences sont efficaces mais le bâtiment mériterait une rénovation.' },
    ]);
    console.log('Seeded reviews.');


    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Error during database initialization:', error);
  } finally {
    await db.destroy();
    process.exit(0);
  }
}

initializeDatabase();
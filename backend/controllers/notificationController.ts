import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import webpush from 'web-push';
import knex from 'knex';
import config from '../knexfile';

const db = knex(config.development);

// ---- VAPID Keys ----
// IMPORTANT: Ces clés doivent être stockées de manière sécurisée dans des variables d'environnement (.env)
// et ne JAMAIS être commitées directement dans le code en production.
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || 'BDP53jGz8nQJ_Vl-8tW_g-p-eUDpZ6AnD4g8Jc0Soa2aVW2zC1e5vVztf55LzndfY3uGQGMEs2Lw07UaXN2nLso';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '2SjPZWACzaLzSPbfkUuY1-J3bBfM4zXqPb_5T0yB5Zg';

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.error("VAPID keys are not defined. Push notifications will not work.");
} else {
    webpush.setVapidDetails(
        'mailto:admin@pharma-garde.com',
        VAPID_PUBLIC_KEY,
        VAPID_PRIVATE_KEY
    );
}

// FIX: Use aliased ExpressRequest and ExpressResponse types.
export const getVapidPublicKey = (req: ExpressRequest, res: ExpressResponse) => {
    res.json({ key: VAPID_PUBLIC_KEY });
};

// FIX: Use aliased ExpressRequest and ExpressResponse types.
export const subscribe = async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    const subscription = req.body;
    try {
        await db('push_subscriptions').insert({
            endpoint: subscription.endpoint,
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth,
        }).onConflict('endpoint').ignore();

        res.status(201).json({ success: true });
    } catch(error) {
        next(error);
    }
};

// FIX: Use aliased ExpressRequest and ExpressResponse types.
export const unsubscribe = async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    const { endpoint } = req.body;
     try {
        await db('push_subscriptions').where({ endpoint }).del();
        res.status(200).json({ success: true });
    } catch(error) {
        next(error);
    }
};

export const sendNotifications = async (payload: string) => {
    try {
        const subscriptions = await db('push_subscriptions').select('*');
        
        const notificationPromises = subscriptions.map(sub => {
            const subscription = {
                endpoint: sub.endpoint,
                keys: {
                    p256dh: sub.p256dh,
                    auth: sub.auth,
                },
            };
            return webpush.sendNotification(subscription, payload)
                .catch(err => {
                    // Si l'abonnement n'est plus valide (ex: l'utilisateur a révoqué la permission),
                    // le supprimer de la base de données.
                    if (err.statusCode === 410 || err.statusCode === 404) {
                        console.log(`Subscription ${sub.endpoint} has expired or is invalid. Deleting.`);
                        return db('push_subscriptions').where({ id: sub.id }).del();
                    } else {
                        console.error(`Failed to send notification to ${sub.endpoint}:`, err);
                    }
                });
        });

        await Promise.all(notificationPromises);
        console.log(`Notifications envoyées à ${subscriptions.length} abonnés.`);

    } catch (error) {
        console.error("Erreur lors de la récupération des abonnements ou de l'envoi des notifications:", error);
    }
};
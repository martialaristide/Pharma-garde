import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AuthenticatedRequest } from '../middleware/auth';
import knex from 'knex';
import config from '../knexfile';
import { sendNotifications } from './notificationController';

const db = knex(config.development);

interface Review {
    id: number;
    establishmentId: number;
    userId: number;
    userName: string;
    rating: number;
    comment: string;
    created_at: string;
    updated_at: string;
}

// Haversine formula to calculate distance
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

// FIX: Use aliased ExpressRequest and ExpressResponse types.
export const getEstablishments = async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    const { lat, lon, radius } = req.query;

    try {
        const establishments = await db('establishments').select('*');

        // Fetch reviews for all establishments
        const establishmentIds = establishments.map(e => e.id);
        const reviews: Review[] = await db('reviews')
            .whereIn('establishmentId', establishmentIds)
            .orderBy('created_at', 'desc');

        // Group reviews by establishmentId
        const reviewsByEstablishment = reviews.reduce((acc, review) => {
            const establishmentId = review.establishmentId;
            if (!acc[establishmentId]) {
                acc[establishmentId] = [];
            }
            acc[establishmentId].push(review);
            return acc;
        }, {} as Record<number, Review[]>);

        // Calculate average rating
        const avgRatings: Record<number, number> = {};
        for (const establishmentId in reviewsByEstablishment) {
            const establishmentReviews = reviewsByEstablishment[establishmentId];
            const totalRating = establishmentReviews.reduce((sum, r) => sum + r.rating, 0);
            avgRatings[establishmentId] = totalRating / establishmentReviews.length;
        }


        let results = establishments.map(e => ({
            ...e,
            hours: JSON.parse(e.hours),
            reviews: reviewsByEstablishment[e.id] || [],
            avgRating: avgRatings[e.id] || 0,
            distance: (lat && lon) ? calculateDistance(Number(lat), Number(lon), e.lat, e.lon) : null
        }));
        
        // Filter by radius if provided
        if (lat && lon && radius) {
            results = results.filter(e => e.distance !== null && e.distance <= Number(radius));
        }

        if (lat && lon) {
            results.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
        }

        res.json(results);
    } catch (error) {
        next(error);
    }
};

// FIX: Use aliased ExpressResponse type.
export const createEstablishment = async (req: AuthenticatedRequest, res: ExpressResponse, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, type, address, lat, lon, phone, hours, photoUrl, onDuty, open24h } = req.body;
    
    try {
        const [newEstablishmentId] = await db('establishments').insert({
            name,
            type,
            address,
            lat,
            lon,
            phone,
            hours: JSON.stringify(hours),
            photoUrl,
            onDuty,
            open24h
        }).returning('id');

        const newEstablishment = await db('establishments').where({ id: (newEstablishmentId as any).id || newEstablishmentId }).first();
        
        if (newEstablishment) {
             res.status(201).json({
                ...newEstablishment,
                hours: JSON.parse(newEstablishment.hours),
                reviews: [],
                avgRating: 0,
                distance: null
             });
        } else {
            throw new Error('La création de l\\'établissement a échoué');
        }

    } catch (error) {
        next(error);
    }
};

// FIX: Use aliased ExpressResponse type.
export const addReview = async (req: AuthenticatedRequest, res: ExpressResponse, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id: establishmentId } = req.params;
    const { rating, comment } = req.body;
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    
    try {
        const [newReviewId] = await db('reviews').insert({
            establishmentId: parseInt(establishmentId),
            userId: user.id,
            userName: user.name,
            rating,
            comment
        }).returning('id');

        const newReview = await db('reviews').where({ id: (newReviewId as any).id || newReviewId }).first();

        res.status(201).json(newReview);
    } catch (error) {
        next(error);
    }
};

// FIX: Use aliased ExpressResponse type.
export const updateEstablishmentStatus = async (req: AuthenticatedRequest, res: ExpressResponse, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id: establishmentId } = req.params;
    const { onDuty } = req.body;

    try {
        const establishment = await db('establishments').where({ id: establishmentId }).first();
        if (!establishment) {
            return res.status(404).json({ message: 'Établissement non trouvé' });
        }

        await db('establishments').where({ id: establishmentId }).update({ onDuty });

        // Envoyer la notification
        const message = onDuty 
            ? `La pharmacie "${establishment.name}" est maintenant de garde.`
            : `La pharmacie "${establishment.name}" n'est plus de garde.`;
        
        const payload = JSON.stringify({
            title: 'Changement de statut',
            body: message,
        });

        // N'attend pas la fin de l'envoi pour répondre, pour une meilleure réactivité
        sendNotifications(payload).catch(err => console.error("Erreur lors de l'envoi des notifications en arrière-plan:", err));
        
        res.status(204).send();

    } catch(error) {
        next(error);
    }
};
import express, { Application, Request as ExpressRequest, Response as ExpressResponse } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';

import authRoutes from './routes/auth';
import establishmentRoutes from './routes/establishments';
import userRoutes from './routes/user';
import aiRoutes from './routes/ai';
import notificationRoutes from './routes/notifications';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();
const PORT = process.env.PORT || 3001;

// --- Simplified and Permissive CORS for Development ---
// This configuration allows requests from any origin, resolving the "Failed to fetch" error.
// For a production environment, you should restrict this to your frontend's domain.
// Example: app.use(cors({ origin: 'https://your-app-domain.com' }));
app.use(cors());


// Configure helmet to be less strict about cross-origin requests to prevent conflicts with CORS.
app.use(helmet({ crossOriginResourcePolicy: false }));

app.use(express.json());

// Routes
// FIX: Use aliased ExpressRequest and ExpressResponse to fix type errors.
app.get('/', (req: ExpressRequest, res: ExpressResponse) => {
    res.send('Pharma Garde API is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/establishments', establishmentRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);

// Error Handling Middleware
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
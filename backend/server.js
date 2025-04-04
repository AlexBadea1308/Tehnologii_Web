import express from 'express';
import { connectDB } from './config/db.js';
import userRoutes from './routes/user.route.js';
import registerRoutes from './routes/register.route.js';
import loginRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import player_statsRoutes from './routes/playerStats.route.js';
import orderRoutes from './routes/order.route.js';
import contractRoutes from './routes/contract.route.js';
import matchRoutes from './routes/match.route.js';
import ticketRoutes from './routes/ticket.route.js';
import trainingPlanRoutes from './routes/trainingPlan.route.js';
import matchSquadRoutes from './routes/squad.route.js';
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/users",userRoutes);
app.use("/api/register",registerRoutes);
app.use("/api/login",loginRoutes);
app.use("/api/products",productRoutes);
app.use("/api/player-stats",player_statsRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/contracts",contractRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/training-plans', trainingPlanRoutes);
app.use('/api/match-squads', matchSquadRoutes);

app.listen(PORT, () => {
    connectDB();    
    console.log("Server started at http://localhost:"+PORT);
});
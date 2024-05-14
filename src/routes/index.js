import { Router } from 'express';
import userRoutes from '../modules/user/user.routes.js';
import roomRoutes from '../modules/room/room.routes.js';

const apiRoutes = Router();


apiRoutes.use('/users', userRoutes);
apiRoutes.use('/rooms', roomRoutes);
// apiRoutes.use('/meet', meetRoutes);
// apiRoutes.use('/attendance', attendanceRoutes);


export default apiRoutes;

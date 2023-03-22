import { Router, Request, Response } from 'express';

const router = Router();

router.get('/graphql', (req: Request, res: Response) => {
    return res.send('Hello from graphql!');
});

export default router;

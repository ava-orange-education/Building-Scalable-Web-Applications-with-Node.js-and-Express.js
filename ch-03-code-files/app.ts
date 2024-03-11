import * as express from 'express';
import { Request, Response } from 'express';
const app: express.Application = express();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

import { DatabaseUtil } from '../../utils/db';
import { ExpressServer } from '../../express_server';
import chai from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);


let app, expressServer;

before(async () => {
    const databaseUtil = new DatabaseUtil();
    await databaseUtil.connectDatabase();
    expressServer = new ExpressServer();
    app = expressServer.app;
});
// Close the server after all tests are done
after(function (done) {
    expressServer.closeServer(done);
});

export { app };

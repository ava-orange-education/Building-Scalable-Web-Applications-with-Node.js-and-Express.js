export interface IServerConfig {
    port: number;
    db_config: {
        'db': string;
        'username': string;
        'password': string;
        'host': string;
        'port': number;
        'dbname': string;
    };
}

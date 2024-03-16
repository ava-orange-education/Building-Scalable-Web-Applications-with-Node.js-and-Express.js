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
    email_config: {
        'from': string;
        'user': string;
        'password': string;
    };
    front_app_url: string;
    default_user?: {
        email: string;
        password: string;
    };
}
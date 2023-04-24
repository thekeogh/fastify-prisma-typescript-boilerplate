declare namespace Api {
  namespace Core {

    namespace Config {
      interface Api {
        environment: {
          env: Api.Environment;
          port: number;
          host?: string;
        };
        logging: {
          level: Api.LogLevel;
        };
        swagger: {
          title: string;
          description: string;
          url: string;
        };
        api: {
          prefix: string;
        };
      }
    }
    
  }
}
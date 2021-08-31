import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config'
const DATABASE = config.get('db')

// synchronize true 는 production 모드에서는 false 로 설정한다. false 로 설정하지 않을 시, 데이터를 잃을 수 있다.
// entity 는 생성한 entity 를 하나 씩 넣어 줄 수도 있지만, __dirname 을 이용해서 작성하면 모든 엔티티를 다 포함하게 된다.
// 하나씩 작성해야 할 경우 entities: [User, Board] 등과 같이 넣어준다.
export const typeORMConfig: TypeOrmModuleOptions = {
  type: DATABASE.type,
  host: process.env.RDS_HOSTNAME || DATABASE.host,
  port: process.env.RDS_PORT || DATABASE.port,
  username: process.env.RDS_USERNAME || DATABASE.username,
  password: process.env.RDS_PASSWORD || DATABASE.password,
  database: process.env.RDS_DB_NAME || DATABASE.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: DATABASE.synchronize,
  retryAttempts: DATABASE.retryAttempts,
};

jest.mock('../src/database/data', () => {
  const SequelizeMock = require("sequelize-mock");
  const Models = require('../src/database/models');
  const DBThirdModels = require('../src/database/dbthirdModels');
  class DatabaseMock {
      constructor(DBName) {
          this.sequelize = new SequelizeMock('database', 'username', 'password', {
              dialect: 'sqlite',
              storage: ':memory:',
          });
          if (DBName === 'db_user') {
              this.models = new Models(this.sequelize);
          } else if (DBName === 'db_third') {
              this.models = new DBThirdModels(this.sequelize);
          }
      }

      async connect() {
          try {
              await this.sequelize.authenticate();
              console.log('Conexión a la base de datos establecida correctamente.');
          } catch (error) {
              console.error('Error al conectar a la base de datos:', error);
          }
      }

      async defineModel(modelName, fields) {
          return this.sequelize.define(modelName, fields);
      }

      async syncModels() {
          try {
              await this.sequelize.sync();
              console.log('Modelos sincronizados correctamente.');
          } catch (error) {
              console.error('Error al sincronizar modelos:', error);
          }
      }
  }
  return DatabaseMock;
});

const supertest = require('supertest');
const app = require('../src/index');

describe('health check', () => {
  let request;
  let server;
  beforeAll((done) => {
    server = app.listen(done);
    request = supertest(server);
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should return health ok 200', async () => {
    await request.get('/health/status').then((response) => {
      expect(response.status).toBe(200);
    });
  });

  it('should return ok 200', async () => {
    await request.get('/').then((response) => {
      expect(response.status).toBe(200);
    });
  });


});

import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

export default {
  // ...ou module.exports se pref
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
};

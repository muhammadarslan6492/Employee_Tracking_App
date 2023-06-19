import redis from 'redis';
import { promisify } from 'util';

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(6379);

export default client;

// const getAsync = promisify(client.get).bind(client);
// const setAsync = promisify(client.set).bind(client);
// const delAsync = promisify(client.del).bind(client);
// const hkeysAsync = promisify(client.hkeys).bind(client);
// const hgetAsync = promisify(client.hget).bind(client);
// const hexistsAsync = promisify(client.hexists).bind(client);
// const hdelAsync = promisify(client.hdel).bind(client);
// const keysAsync = promisify(client.keys).bind(client);

// const setObjAsync = async (key, obj, expiryInSeconds = 0) => {
//   const str = JSON.stringify(obj);
//   if (expiryInSeconds) await setAsync(key, str, 'EX', expiryInSeconds);
//   else await setAsync(key, str);
//   return true;
// };
// const getObjAsync = async (key) => {
//   const objStr = await getAsync(key);
//   if (!objStr) return null;
//   try {
//     return JSON.parse(objStr);
//   } catch (e) {
//     return null;
//   }
// };
// const setHObjAsync = async (topKey, key, obj) => {
//   const str = JSON.stringify(obj);
//   await client.hmset(topKey, [key, str]);
// };
// const getHObjAsync = async (topKey, key) => {
//   const objStr = await hgetAsync(topKey, key);
//   if (!objStr) return null;
//   try {
//     return JSON.parse(objStr);
//   } catch (e) {
//     return null;
//   }
// };
// export default {
//   client,
//   getAsync,
//   setAsync,
//   keysAsync,
//   hkeysAsync,
//   hgetAsync,
//   hexistsAsync,
//   hdelAsync,
//   delAsync,
//   setObjAsync,
//   getObjAsync,
//   setHObjAsync,
//   getHObjAsync,
// };

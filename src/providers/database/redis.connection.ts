import Redis from 'ioredis'

const redisClient = new Redis();

export class RedisConfig {
  static async set(key: string , value:any,expirationTimeInSeconds?: number){
    try{
      const serializedValue = JSON.stringify(value);
      await redisClient.set(key,serializedValue);
      if(expirationTimeInSeconds){
        await redisClient.expire(key,expirationTimeInSeconds)
      }
    }
    catch(error){
      console.error('Redis set error:',error)
    }
  }

  static async get(key:string){
    try{
      const cachedData = await redisClient.get(key);
      if(cachedData){
        return JSON.parse(cachedData)
      }
      return null;
    } catch(error){
      console.error('Redis get error:',error)
      return null;
    }
  }
}

export const redis = new Redis({
    port: 6379,
    host:"localhost"
  });

  
  export const closeRedisConnection = () => {
    redis.disconnect();
  }
import Redis from 'ioredis'


export const redis = new Redis({
    port: 6379,
    host:"localhost"
  });

  export const getClient = () =>{
    return new Redis({
        port:6379,
        host:'localhost',
    })
  }
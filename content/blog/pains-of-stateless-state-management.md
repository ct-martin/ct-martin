---
title: 'Pains of Stateless State Management'
date: Tue, 18 Dec 2018 17:05:50 +0000
draft: false
tags: ['599 - Dual-touch Design', 'Programming']
---

As it would turn out, synchronizing states is _really_ hard.

The tech used for this app is fairly common. The client is rendered using p5.js, the server uses Node.js, Redis stores states, & data is passed between the two using websockets via socket.io

The biggest difficulty is that there are multiple devices per player and multiple players connected at the same time. I have to make sure that all necessary data is synchronized efficiently, but I also need a single source of truth to fall back on. I ended up accomplishing this by using an MVC-like approach where the server tells the client the basic data it needs to render, and the client relies on the server to validate actions taken by the player. Since there are multiple connections for a given user and a single connection doesn’t automatically know the other connections, I have to rely on Redis to store the other connection IDs to tell them information. Additionally, I’ve had connections drop randomly and it’s necessary to not lose the game’s state because of that.  

Redis is also an important part because it helps a lot in development testing (I can restart the client or server after fixing a logic bug and keep going without re-doing the entire game from scratch). Aside from testing though, I’ve had more than a few times when the Node server or dual-touchscreen laptop has crashed, which is automatically accounted for the same way. Redis also allows horizontal scaling in the future. Due to the simplicity to implement and the near-complete reliance on Redis to control state, scaling in theory already works, but I haven’t tested it yet.

The only variables that get stored on the server are the socket ID and the session ID (assigned via Express cookies, synchronized with Redis as well). This is because it’s done as part of the handshake and I otherwise have no way to identify the individual connection as well as the user as a set of multiple connection. This data is safe to store in a local variable in the connection event handler because it doesn’t affect the gameplay since it doesn’t contain any of the information about the game state itself, just who the connection is. In order to maintain this single source of truth, the game event logic has needed to be stateless. This makes it a ton easier to synchronize state, but makes individual events more complex to code. It’s honestly more of a mindset thing rather than a coding thing since a variable is being updated somewhere, but having to think in database queries (with callbacks) rather than OOP-like variable changing for _everything_ is more complex to me since I’m less familiar with it.

Another caveat that comes with Redis as the source of truth though is that I have to query every time I want a variable because it’s not stored in the server’s memory. This essentially doubles the effort it takes to do simple operations since I can’t reference an object like you normally would in OOP. Instead of:

```js
socket.on('ingame', cb2 => {  
  if (gamesBySession.exists(sessionid)) {  
    const gameId = gamesBySession[sessionid];  
    console.log(`'${sessionid}' has rejoined game '${gameId}'`);  
    return cb2(gameId);  
  }  
  return cb2(-1);  
}));
```

I have to do:

```js
socket.on('ingame', cb2 =>  
 redisClient.exists(`gameOf.${sessionid}`, (err, inGame) => {  
  if (inGame === 1) {  
    return redisClient.get(`gameOf.${sessionid}`, (err2, gameId) => {  
      console.log(`'${data.session}' has rejoined game '${gameId}'`);  
      return cb2(gameId);  
    });  
  }  
  return cb2(-1);  
}));  

```

As you can see, the calculation & event logic is about the same, but referencing variables is significantly more complex. Additionally, since I need an error variable for each query, I’ve ended up appending the level of nesting to the end of it, which is bad practice and then I end up with `err9` and such for variable names.  

However, Redis makes this a lot more complicated because node_redis uses callbacks or Promises to get data from it. When you’re querying a lot of variables, you very quickly get into callback hell, regardless of which you use. Using Multi-exec or `Promise.all()` also don’t work since I need to get the values of all the queried keys. Finally, there are some differences between node_redis and the Redis spec for how some commands are handled, and these are not documented. For example, [the Redis docs say for LINDEX](https://redis.io/commands/lindex), “When the value at key is not a list, an error is returned.” However, node_redis returns no error, but rather `NULL` for the return value. It something that a debug log can tell you, but these undocumented differences makes debugging a lot longer and are an unneeded hassle.

Finally, I haven’t finished debugging why yet, but I’ve found that non-`HttpOnly` cookies seem to not get passed to the client when behind Cloudflare’s CDN. I know this isn’t a proper way to identify users, but it works for the purposes of what I’m trying to accomplish and I need the `sessionid` accessible to the JavaScript to identify the client to the server. JSON Web Tokens would be a good replacement for the current scheme, but that’s more work for another time.  
For future work on this I’m considering an OOP-style referencing scheme using method chaining even though individual variables wouldn’t work because of the stateless factor. For example, the OOP `this.game.me.ships` (`this.game.player(this).ships` if static) would be `game(sessionid).me().ships()`. While this isn’t “proper” OOP per say, it works, and I had some bad luck when I tried using ES6 class or Node’s `module.exports` to do OOP methods before. It also won’t be fun to implement due to everything being methods and the nesting on the variable side will probably be as bad as it is now, but it will make the game logic much cleaner to decouple the server & Redis communication from the game logic itself.

All in all, the result works, but wow, it was a pain at times. What I had expected to be a sort of relaxing project to make a fun experience ended up being a learning experience in networking & state management I didn’t really expect. It lacks some polish, particularly in the visuals, but as a proof of concept it did quite well.

Final code: [https://github.com/ct-martin/Battleship](https://github.com/ct-martin/Battleship)

_Note: post backdated to intended date since it didn't get auto-published_

---

_Updates:_  
_2019-07-31: Content reflow_
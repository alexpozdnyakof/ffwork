export function dispatcher(){
  const subscriptions = new Map();
  const afterWares = new Array();

  return ({
    subscribe(commandName, handler) {
      if(!subscriptions.has(commandName)) subscriptions.set(commandName, []);
      
      const handlers = subscriptions.get(commandName);
      if(handlers.includes(handler)) return () => {};

      handlers.push(handler);

      return () => {
        const idx = handlers.indexOf(handler);
        handlers.splice(idx, 1);
      }
    },
    after(handler) {
      afterWares.push(handler);
      return () => {
        const idx = afterWares.indexOf(handler);
        afterWares.splice(idx,1);
      }
    },
    dispatch(commandName, payload) {
      if(subscriptions.has(commandName)) {
        subscriptions.get(commandName).forEach(handler => handler(payload));
      } else {
        console.warn(`No handlers for command ${commandName}`);
      }
      afterWares.forEach(handler => handler(payload));
    }
  })
}


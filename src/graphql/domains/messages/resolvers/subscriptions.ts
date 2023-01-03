import { PubSub } from 'graphql-subscriptions'

const pubsub = new PubSub()

export default {
  Subscription: {
    numberIncremented: {
      subscribe: () => {
        return pubsub.asyncIterator(['NUMBER_INCREMENTED'])
      }
    }
  }
}

let currentNumber = 0;
function incrementNumber() {
  currentNumber++;
  pubsub.publish('NUMBER_INCREMENTED', { numberIncremented: currentNumber });
  setTimeout(incrementNumber, 1000);
}

// Start incrementing
incrementNumber();

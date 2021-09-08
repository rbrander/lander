/*
Implement a simple pseudo random number generator using a seed.

Javascript's random number generator is based on time and doesn't allow
a seed to be passed in.

https://en.wikipedia.org/wiki/Linear_congruential_generator

X(n+1) = (a * X(n) + c) mod m

Using Borland C's implementation:
m (modulus) = 2^32
a (multiplier) = 22695477
c (incrementer) = 1

ANSI C:
m = 2^31
a = 1103515245
c = 12345

How long it takes to create random numbers
  10**3 =   1 thousand = 0ms
  10**4 =  10 thousand = 2ms
  10**5 = 100 thousand = 7ms
  10**6 =    1 million = 21ms
  10**7 =   10 million = 173ms
  10**8 =  100 million = 1689ms (1.68 seconds)
  10**9 =    1 billion = 16839ms (16.8 seconds)
*/

const MODULUS = 2**31
const MULTIPLIER = 1103515245
const INCRMENTER = 12345
let lastSeed;
let lastNumber;

const random = (seed = 0, returnPct = true) => {
  // check for a new seed
  if (seed !== lastSeed) {
    // reset the last number to the seed
    lastNumber = lastSeed = seed
  }
  const nextNumber = (MULTIPLIER * lastNumber + INCRMENTER) % MODULUS
  lastNumber = nextNumber
  return returnPct ? (nextNumber / MODULUS) : nextNumber
}

module.exports = random

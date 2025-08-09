export function useCounter(initialValue: number = 0) {
  const count = ref<number>(initialValue)

  function increment(step: number = 1) {
    count.value += step
  }

  function decrement(step: number = 1) {
    count.value -= step
  }

  function reset(newValue: number = initialValue) {
    count.value = newValue
  }

  return { count, increment, decrement, reset }
}



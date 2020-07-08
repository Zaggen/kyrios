// @flow

const delay = (time: number, timeoutsTracker?: TimeoutID[]): Promise<void> =>
  new Promise(resolve => {
    const timeoutId = setTimeout(() => {
      resolve()
    }, time)
    if (timeoutsTracker) {
      timeoutsTracker.push(timeoutId)
    }
  })

export default delay

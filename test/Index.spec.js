import VueCoeCalendar from '../'

/* eslint-disable */
describe('VueCoerousel', () => {
  test('is a Vue instance', () => {
    const wrapper = shallowMount(VueCoeCalendar)

    expect (wrapper.isVueInstance()).toBeTruthy()
  })
})

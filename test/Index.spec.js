
import { shallowMount } from '@vue/test-utils'
import VueCoeCalendar from '../src/components/Carousel.vue'

/* eslint-disable */
describe('VueCoerousel', () => {
  test('is a Vue instance', () => {
    const wrapper = shallowMount(VueCoeCalendar)

    expect (wrapper.isVueInstance()).toBeTruthy()
  })
})

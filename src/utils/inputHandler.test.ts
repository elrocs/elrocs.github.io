/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setupInput } from './inputHandler'

describe('setupInput', () => {
  let canvas: HTMLCanvasElement
  let createParticle: ReturnType<typeof vi.fn>
  const PIXEL_SIZE = 10
  const WIDTH = 100
  const HEIGHT = 100

  beforeEach(() => {
    canvas = document.createElement('canvas')
    canvas.getBoundingClientRect = vi.fn(() => ({
      left: 0,
      top: 0,
      right: 1000,
      bottom: 1000,
      width: 1000,
      height: 1000,
      x: 0,
      y: 0,
      toJSON: () => {},
    }))

    createParticle = vi.fn()
    setupInput(canvas, PIXEL_SIZE, WIDTH, HEIGHT, createParticle)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('creates particles on mousedown and mousemove', () => {
    const mousedownEvent = new MouseEvent('mousedown', {
      clientX: 15,
      clientY: 25,
      bubbles: true,
    })
    canvas.dispatchEvent(mousedownEvent)

    expect(createParticle).toHaveBeenCalled()
    const callsAfterMousedown = createParticle.mock.calls.length

    const mousemoveEvent = new MouseEvent('mousemove', {
      clientX: 20,
      clientY: 30,
      bubbles: true,
    })
    canvas.dispatchEvent(mousemoveEvent)

    expect(createParticle.mock.calls.length).toBeGreaterThan(
      callsAfterMousedown,
    )

    const mouseupEvent = new MouseEvent('mouseup', { bubbles: true })
    canvas.dispatchEvent(mouseupEvent)
  })

  it('creates particles on touchstart and touchmove', () => {
    const touch = new Touch({
      identifier: 1,
      target: canvas,
      clientX: 35,
      clientY: 45,
      radiusX: 1,
      radiusY: 1,
      rotationAngle: 0,
      force: 1,
    })

    const touchstartEvent = new TouchEvent('touchstart', {
      touches: [touch],
      bubbles: true,
    })
    canvas.dispatchEvent(touchstartEvent)

    expect(createParticle).toHaveBeenCalled()
    const callsAfterTouchstart = createParticle.mock.calls.length

    const touchMove = new Touch({
      identifier: 1,
      target: canvas,
      clientX: 40,
      clientY: 50,
      radiusX: 1,
      radiusY: 1,
      rotationAngle: 0,
      force: 1,
    })
    const touchmoveEvent = new TouchEvent('touchmove', {
      touches: [touchMove],
      bubbles: true,
    })
    canvas.dispatchEvent(touchmoveEvent)

    expect(createParticle.mock.calls.length).toBeGreaterThan(
      callsAfterTouchstart,
    )

    const touchendEvent = new TouchEvent('touchend', { bubbles: true })
    canvas.dispatchEvent(touchendEvent)
  })

  it('does not create particles when not drawing on mousemove', () => {
    const mousemoveEvent = new MouseEvent('mousemove', {
      clientX: 50,
      clientY: 50,
      bubbles: true,
    })
    canvas.dispatchEvent(mousemoveEvent)

    expect(createParticle).not.toHaveBeenCalled()
  })
})

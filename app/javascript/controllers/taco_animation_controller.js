// Taco-Price-Index\app\javascript\controllers\taco_animation_controller.js

import { Controller } from '@hotwired/stimulus'
import { gsap } from 'gsap'

export default class extends Controller {
  static values = { rating: Number }

  connect() {
    console.log('Taco animation controller connected!')
    console.log('Initial Rating:', this.ratingValue)

    // Get references to your SVG elements
    this.tacoLeft = this.element.querySelector('#taco-left') // This will be the stationary left half
    this.tacoRight = this.element.querySelector('#taco-right') // This will be the moving right half
    this.cheese = this.element.querySelector('#cheese')

    // Call the animation function when connected
    this.animateTaco(this.ratingValue)
  }

  ratingValueChanged() {
    console.log('Rating changed to:', this.ratingValue)
    this.animateTaco(this.ratingValue) // Re-run animation if rating changes
  }

  animateTaco(rating) {
    const clampedRating = Math.max(0, Math.min(5, rating))

    // Normalize rating to a 0-1 scale for easier calculation
    // Assuming 1-5 scale: 1 -> 0, 5 -> 1
    const normalizedRating = (clampedRating - 1) / 4

    // --- Animation Logic based on Rating ---

    // 1. Taco Halves Movement
    // The left taco half (tacoLeft) will remain stationary (x: 0 relative to its initial position).
    // The right taco half (tacoRight) will move to the right.
    // Increased maxRightTacoMovement to make the effect more visible.
    // You can adjust this value further based on how wide you want the taco to open.
    const maxRightTacoMovement = 300 // Increased from 100 to 150 for more noticeable movement
    const currentRightTacoMovement = normalizedRating * maxRightTacoMovement

    // Animate the left taco shell to stay stationary
    gsap.to(this.tacoLeft, {
      x: 0, // Stays at its original X position (relative to its initial SVG path coordinates)
      duration: 1.0,
      ease: 'power2.out',
    })

    // Animate the right taco shell to move based on the rating
    gsap.to(this.tacoRight, {
      x: currentRightTacoMovement, // Move right taco to the right from its original position
      duration: 1.0,
      ease: 'power2.out',
    })

    // Move the cheese to simulate spreading with the opening
    // We'll move cheese by half the right taco's movement to simulate spread
    // This ensures the cheese stays visually centered between the shells as they open.
    const fillingsMovement = currentRightTacoMovement / 2

    gsap.to(this.cheese, {
      x: fillingsMovement, // Move cheese to the right
      duration: 1.0,
      ease: 'power2.out',
    })

    // 2. Cheddar Cheese Stretching (still using scaleY)
    // The scaleY animation will still work relative to the cheese element's own center.
    const maxCheeseStretchY = 1.5 // Max 150% of original height
    const cheeseScaleY = 1 + normalizedRating * (maxCheeseStretchY - 1)

    gsap.to(this.cheese, {
      scaleY: cheeseScaleY,
      transformOrigin: 'center center',
      duration: 1.0,
      ease: 'power2.out',
    })

    // Optional: Animate the fill color of the taco halves slightly to indicate "fullness"
    const tacoFillColor = gsap.utils.interpolate(
      '#D2B48C',
      '#C09A6B',
      normalizedRating
    )
    gsap.to([this.tacoLeft, this.tacoRight], {
      duration: 1,
      ease: 'power2.out',
      fill: tacoFillColor,
    })
  }
}

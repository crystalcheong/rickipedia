import { useDrag } from "@use-gesture/react"
import { useState } from "react"
import { animated, interpolate, useSprings } from "react-spring"

import CharacterCard from "@/components/Character.Card"
import { type RickAndMorty } from "@/types/rickAndMorty"
import { cn, getLimitedRandomArray, logger, LogLevel } from "@/utils"

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = (i: number) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
})
const from = (_i: number) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 })
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r: number, s: number) =>
  `perspective(1500px) rotateX(30deg) rotateY(${
    r / 10
  }deg) rotateZ(${r}deg) scale(${s})`
const isDragEvent = (eventType: string) => {
  const dragEvents: string[] = ["mousemove", "touchmove", "pointermove"]
  return dragEvents.includes(eventType.toLowerCase())
}
interface CharacterDeckProps {
  characters: RickAndMorty.Character[]
  limit?: number
}

const CharacterDeck = ({ characters, limit = 5 }: CharacterDeckProps) => {
  const [deckCharacters, setDeckCharacters] = useState<
    RickAndMorty.Character[]
  >(getLimitedRandomArray(characters, limit))

  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [gone] = useState(() => new Set()) // The set flags all the cards that are flicked out
  const [props, api] = useSprings(deckCharacters.length, (i) => ({
    ...to(i),
    from: from(i),
  })) // Create a bunch of springs using the helpers above

  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useDrag(
    ({
      event,
      args: [index],
      active,
      movement: [mx],
      direction: [xDir],
      velocity: [vx],
    }) => {
      event.preventDefault()
      event.stopPropagation()
      setIsDragging(isDragEvent(event.type))

      const trigger = vx > 0.2 // If you flick hard enough it should trigger the card to fly out
      if (!active && trigger) gone.add(index) // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
      api.start((i) => {
        if (index !== i) return // We're only interested in changing spring-data for the current spring
        const isGone = gone.has(index)
        const x = isGone ? (200 + window.innerWidth) * xDir : active ? mx : 0 // When a card is gone it flys out left or right, otherwise goes back to zero
        logger(
          { breakpoint: "[Character.Deck.tsx:64]", level: LogLevel.Debug },
          {
            x,
            xDir,
            isGone,
            i,
          }
        )
        const rot = mx / 100 + (isGone ? xDir * 10 * vx : 0) // How much the card tilts, flicking it harder makes it rotate faster
        const scale = active ? 1.1 : 1 // Active cards lift up a bit
        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: active ? 800 : isGone ? 200 : 500 },
        }
      })

      // All cards cleared
      if (!active && gone.size === deckCharacters.length)
        setTimeout(() => {
          // Clear deck
          gone.clear()
          // Shuffle deck
          setDeckCharacters(getLimitedRandomArray(characters, limit))
          // Transition entries
          api.start((i) => to(i))
        }, 600)
    }
  )

  return (
    <section
      className={cn(
        "relative min-h-[300px]",
        "flex place-content-center place-items-center md:flex-wrap"
      )}
    >
      {props.map(({ x, y, rot, scale }, i) => {
        const character = deckCharacters[i]
        if (!character) return null

        return (
          <animated.div
            key={i}
            className={cn(
              "will-change-transform",
              "absolute inset-0",
              "flex place-content-center place-items-center",
              "md:relative"
            )}
            style={{ x, y }}
          >
            {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
            <animated.div
              {...bind(i)}
              style={{
                transform: interpolate([rot, scale], trans),
              }}
              className={cn("touch-none will-change-transform")}
            >
              <CharacterCard
                character={character}
                className={cn("shadow-lg")}
                disableOnClick={isDragging || gone.has(i)}
              />
            </animated.div>
          </animated.div>
        )
      })}
    </section>
  )
}

export default CharacterDeck

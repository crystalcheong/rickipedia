import { type ComponentPropsWithoutRef } from "react"
import { animated, useSpring } from "react-spring"

interface RollingNumbersProps extends ComponentPropsWithoutRef<"span"> {
  value: number
}

const RollingNumbers = ({ value, ...rest }: RollingNumbersProps) => {
  const props = useSpring({ val: value, from: { val: 0 } })

  return (
    <animated.span {...rest}>
      {props.val.interpolate((val) => Math.floor(val))}
    </animated.span>
  )
}

export default RollingNumbers

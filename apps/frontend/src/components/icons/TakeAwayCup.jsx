import { Icon } from "lucide-react"
import { cupToGo } from "@lucide/lab"

export default function ({color="var(--white)", size="4rem"}) {
    return (
        <Icon 
        iconNode={cupToGo}
        size={size}
        color="var(--coffee-darker)"
        fill={color}
        strokeWidth={2}
        />
    )
}
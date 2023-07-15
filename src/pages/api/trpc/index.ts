import { type NextApiRequest, type NextApiResponse } from "next"
import { renderTrpcPanel } from "trpc-panel"

import { appRouter } from "@/server/api/root"
import { getBaseUrl } from "@/utils"

export const handler = (_: NextApiRequest, res: NextApiResponse) =>
  res.status(200).send(
    renderTrpcPanel(appRouter, {
      url: `${getBaseUrl()}/api/trpc`,
      transformer: "superjson",
    })
  )

export default handler

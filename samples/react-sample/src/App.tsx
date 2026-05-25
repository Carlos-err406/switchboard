import { useFlag } from '@switchboard/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@switchboard/ui/components/card'
import { Badge } from '@switchboard/ui/components/badge'
import { Flag } from 'lucide-react'

function FlagRow({
  name,
  defaultValue,
}: {
  name: string
  defaultValue?: string | number | boolean | null
}) {
  const value = useFlag(name, defaultValue)
  return (
    <tr className="border-b border-border">
      <td className="p-2.5 flex items-center gap-2">
        <Flag className="size-3.5 text-muted-foreground" />
        {name}
      </td>
      <td className="p-2.5">
        <code className="bg-muted px-1.5 py-0.5 text-xs">
          {String(defaultValue ?? 'undefined')}
        </code>
      </td>
      <td className="p-2.5">
        <code className="bg-muted px-1.5 py-0.5 text-xs">
          {String(value ?? 'undefined')}
        </code>
      </td>
      <td className="p-2.5">
        <Badge variant="outline">{typeof value}</Badge>
      </td>
    </tr>
  )
}

function App() {
  return (
    <div className="max-w-2xl mx-auto p-8 flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <a
              target="_blank"
              href="https://github.com/carlos-err406/switchboard/samples/react-sample"
            >
              @switchboard/react-sample
            </a>
          </CardTitle>
          <CardDescription>
            Toggle flags in the dashboard — values update in realtime.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-foreground">
                <th className="text-left p-2.5 font-medium">Flag</th>
                <th className="text-left p-2.5 font-medium">Default</th>
                <th className="text-left p-2.5 font-medium">Value</th>
                <th className="text-left p-2.5 font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              <FlagRow name="ui_v2" defaultValue={false} />
              <FlagRow name="max_items" defaultValue={10} />
              <FlagRow name="banner" />
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

export default App

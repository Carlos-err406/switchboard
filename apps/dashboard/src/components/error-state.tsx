import {
  ErrorTypes,
  QueryErrorCode,
  isAppError,
  isQueryError,
} from '@convex/errors/helpers'
import {
  CalendarX,
  CircleAlert,
  FileQuestion,
  FlagOff,
  KeyRound,
  Layers,
  Link2Off,
  TriangleAlert,
  UserX,
} from 'lucide-react'
import type { ComponentType } from 'react'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@switchboard/ui/components/empty'

type QueryErrorStateProps = Record<string, never>

const queryErrorComponents: Record<
  QueryErrorCode,
  ComponentType<QueryErrorStateProps>
> = {
  [QueryErrorCode.PROJECT_NOT_FOUND]: () => (
    <ErrorEmpty
      icon={Layers}
      title="Project Not Found"
      description="This project doesn't exist or you don't have access to it."
    />
  ),
  [QueryErrorCode.FLAG_NOT_FOUND]: () => (
    <ErrorEmpty
      icon={FlagOff}
      title="Flag Not Found"
      description="This flag doesn't exist or has been deleted."
    />
  ),
  [QueryErrorCode.ENVIRONMENT_NOT_FOUND]: () => (
    <ErrorEmpty
      icon={Layers}
      title="Environment Not Found"
      description="This environment doesn't exist or has been deleted."
    />
  ),
  [QueryErrorCode.API_KEY_NOT_FOUND]: () => (
    <ErrorEmpty
      icon={KeyRound}
      title="API Key Not Found"
      description="This API key doesn't exist or has been revoked."
    />
  ),
  [QueryErrorCode.INVITE_NOT_FOUND]: () => (
    <ErrorEmpty
      icon={Link2Off}
      title="Invitation Not Found"
      description="This invitation link is invalid or has already been used."
    />
  ),
  [QueryErrorCode.INVITE_EXPIRED]: () => (
    <ErrorEmpty
      icon={CalendarX}
      title="Invitation Expired"
      description="This invitation has expired. Please ask for a new one."
    />
  ),
  [QueryErrorCode.INVITE_ALREADY_USED]: () => (
    <ErrorEmpty
      icon={Link2Off}
      title="Invitation Already Used"
      description="This invitation has already been accepted. Try signing in instead."
    />
  ),
  [QueryErrorCode.USER_NOT_FOUND]: () => (
    <ErrorEmpty
      icon={UserX}
      title="User Not Found"
      description="This user doesn't exist or has been removed."
    />
  ),
}

function ErrorEmpty({
  icon: Icon,
  title,
  description,
}: {
  icon: ComponentType
  title: string
  description: string
}) {
  return (
    <Empty>
      <EmptyMedia>
        <Icon />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

function QueryErrorState({ error }: { error: unknown }) {
  if (!isQueryError(error)) return <AppErrorState error={error} />

  const Component = queryErrorComponents[error.data.code]
  return <Component />
}

function AppErrorState({ error }: { error: unknown }) {
  if (!isAppError(error)) return <UnexpectedErrorState />

  return (
    <ErrorEmpty
      icon={CircleAlert}
      title="Error"
      description={
        error.data.type === ErrorTypes.GENERIC_ERROR
          ? error.data.message
          : 'An unexpected error occurred.'
      }
    />
  )
}

function UnexpectedErrorState() {
  return (
    <ErrorEmpty
      icon={TriangleAlert}
      title="Something Went Wrong"
      description="An unexpected error occurred. Please try again later."
    />
  )
}

function NotFoundState() {
  return (
    <ErrorEmpty
      icon={FileQuestion}
      title="Page Not Found"
      description="The page you're looking for doesn't exist or has been moved."
    />
  )
}

export { AppErrorState, NotFoundState, QueryErrorState, UnexpectedErrorState }

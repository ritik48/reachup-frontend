import { ConnectorDialog } from "./ConnectorDialog";

export function Connect() {
  return (
    <div className="h-screen pt-[100px]">
      <div className="max-w-7xl mx-auto h-full">
        <div className="gap-2 items-start flex flex-col h-full">
          <h1 className="text-4xl">Your Email Senders</h1>
          <div className="flex justify-center mt-20 flex-1 w-full">
            <div className="flex gap-4 flex-col">
              <div className="text-xl text-muted-foreground">
                You don't have any connected email provider.
              </div>
              <ConnectorDialog />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

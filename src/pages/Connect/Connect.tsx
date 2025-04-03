import { ConnectorDialog } from "./ConnectorDialog";

export function Connect() {
  return (
    <div className="mt-[100px]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-2 items-start">
          <h1 className="text-4xl">Your Email Senders</h1>
          <ConnectorDialog />
        </div>
      </div>
    </div>
  );
}

import { Label } from "@/components/ui/label";
import { Client } from "@/types/project";

interface ClientSelectorProps {
  clients: Client[];
  selectedClientId: string;
  onClientChange: (clientId: string) => void;
}

export function ClientSelector({
  clients,
  selectedClientId,
  onClientChange,
}: ClientSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="client" className="text-gray-900">
        Client
      </Label>
      <select
        id="client"
        value={selectedClientId}
        onChange={(e) => onClientChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-md bg-white border-gray-300 text-gray-900"
      >
        <option value="">Select a client</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name} ({client.email})
          </option>
        ))}
      </select>
    </div>
  );
}

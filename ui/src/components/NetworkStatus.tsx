import { useChainId, useAccount } from 'wagmi';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';

export function NetworkStatus() {
  const chainId = useChainId();
  const { isConnected } = useAccount();

  const getNetworkInfo = () => {
    switch (chainId) {
      case 31337:
        return { name: 'Localhost', color: 'bg-green-500', icon: CheckCircle };
      case 11155111:
        return { name: 'Sepolia', color: 'bg-blue-500', icon: CheckCircle };
      case 1:
        return { name: 'Ethereum', color: 'bg-purple-500', icon: CheckCircle };
      case 137:
        return { name: 'Polygon', color: 'bg-pink-500', icon: CheckCircle };
      default:
        return { name: 'Unknown', color: 'bg-gray-500', icon: AlertCircle };
    }
  };

  const networkInfo = getNetworkInfo();
  const IconComponent = networkInfo.icon;

  if (!isConnected) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <WifiOff className="w-3 h-3" />
        Disconnected
      </Badge>
    );
  }

  return (
    <Badge className={`flex items-center gap-1 ${networkInfo.color} text-white`}>
      <IconComponent className="w-3 h-3" />
      {networkInfo.name}
    </Badge>
  );
}

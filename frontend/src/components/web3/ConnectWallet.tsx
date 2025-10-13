import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { 
  ChevronDownIcon, 
  WalletIcon, 
  ArrowRightOnRectangleIcon,
  DocumentDuplicateIcon,
  UserCircleIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [connecting, setConnecting] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied",
        description: "Your wallet address has been copied to clipboard.",
        duration: 2000,
      });
    }
  };

  const handleConnect = async (connector: import('wagmi').Connector) => {
    try {
      setConnecting(true);
      await connect({ connector });
    } catch (error) {
      console.error(error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to wallet. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setConnecting(false);
    }
  };

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-quantum-gray border-quantum-gray-light hover:bg-quantum-gray-light focus:ring-2 focus:ring-primary/40 transition-all"
          >
            <div className="w-3 h-3 rounded-full bg-success mr-2 animate-pulse" />
            <span>{formatAddress(address)}</span>
            <ChevronDownIcon className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-card border-border w-56">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            <div className="flex flex-col space-y-1">
              <span>Connected Wallet</span>
              <span className="font-mono text-xs text-foreground truncate w-44">
                {address}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link to={`/profile/${address}`}>
            <DropdownMenuItem>
              <UserCircleIcon className="w-4 h-4 mr-2" />
              <span>My Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link to="/portfolio">
            <DropdownMenuItem>
              <CreditCardIcon className="w-4 h-4 mr-2" />
              <span>My Portfolio</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={copyAddress}>
            <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
            <span>Copy Address</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => disconnect()} className="text-destructive focus:text-destructive">
            <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="btn-quantum shadow-button">
          <WalletIcon className="w-4 h-4 mr-2" />
          Connect Wallet
          <ChevronDownIcon className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card border-border w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Choose a Wallet
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {connectors.map((connector) => (
          <DropdownMenuItem
            key={connector.id}
            onClick={() => handleConnect(connector)}
            disabled={connecting}
            className="cursor-pointer hover:bg-primary/10"
          >
            <div className="flex items-center justify-between w-full">
              <span>{connector.name}</span>
              {connecting && <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xs text-muted-foreground hover:bg-transparent cursor-default focus:bg-transparent">
          First time? You'll need to approve the connection request in your wallet.
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
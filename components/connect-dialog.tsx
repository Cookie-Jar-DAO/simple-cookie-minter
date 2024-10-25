import { Connector, useAccount, useConnect } from "wagmi";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import { Loader2, Wallet2 } from "lucide-react";
import Image from "next/image";
import { DialogTrigger } from "@radix-ui/react-dialog";
// import { useMediaQuery } from "@/hooks/use-media-query";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";

export default function ConnectDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const { connect, connectors, error, isPending, variables, reset } =
    useConnect();
  const { isConnected } = useAccount();
  // const isDesktop = useMediaQuery("(min-width: 768px)");
  const walletConnectLogo = "https://avatars.githubusercontent.com/u/37784886";
  const coinbaseWalletSDKLogo =
    "https://avatars.githubusercontent.com/u/1885080";

  const customConnectors = [...connectors].sort((a, b) => {
    if (a.type === "injected" && b.type !== "injected") return -1;
    if (a.type !== "injected" && b.type === "injected") return 1;
    return 0;
  });

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  const icon = (connector: Connector) => {
    if (
      isPending &&
      variables &&
      "id" in variables.connector &&
      connector.id === variables.connector.id
    ) {
      return <Loader2 className="h-6 w-6 animate-spin" />;
    }
    return undefined;
  };

  const iconSource = (connector: Connector) => {
    // WalletConnect does not provide an icon, so we provide a custom one.
    if (connector.id === "walletConnect") {
      return walletConnectLogo;
    }
    if (connector.id === "coinbaseWalletSDK" && !connector.icon) {
      return coinbaseWalletSDKLogo;
    }
    return connector.icon;
  };

  const ConnectorContent = () => (
    <div className="flex flex-col gap-2 pb-5">
      {customConnectors.map((connector) => (
        <Button
          className="flex items-center justify-between gap-2 py-6"
          disabled={isConnected || isPending}
          key={connector.id}
          onClick={() => connect({ connector })}
          variant="outline"
        >
          <div className="flex items-center gap-2">
            {iconSource(connector) ? (
              <div className="object-c relative h-6 w-6 overflow-clip rounded-sm object-center">
                <Image
                  layout="fill"
                  src={iconSource(connector) ?? ""}
                  alt={`${connector.name} icon`}
                  unoptimized={true}
                />
              </div>
            ) : (
              <Wallet2 className="h-6 w-6" />
            )}
            <p className="text-sm tracking-tight md:text-base lg:text-lg">
              {connector.name === "Injected"
                ? "Browser wallet"
                : connector.name}
            </p>
          </div>
          {icon(connector)}
        </Button>
      ))}
      {error && (
        <div className="rounded-md bg-red-100 p-2 text-center text-sm text-red-600">
          {error.message}
        </div>
      )}
    </div>
  );

  // if (isDesktop)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />

      <DialogTrigger
        asChild
        className={`${buttonVariants({ variant: "default", size: "sm" })} cursor-pointer`}
      >
        <p>Connect wallet</p>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Connect wallet
          </p>
          <p className="py-3 text-2xl font-semibold tracking-tight">
            Choose a wallet
          </p>
        </DialogTitle>

        <ConnectorContent />
      </DialogContent>
    </Dialog>
  );

  // return (
  //   <Drawer open={isOpen} onOpenChange={setIsOpen}>
  //     <DrawerClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />

  //     <DrawerTrigger
  //       asChild
  //       className={buttonVariants({ variant: "default", size: "sm" })}
  //     >
  //       <div className="flex items-center justify-center gap-2">
  //         Connect wallet
  //       </div>
  //     </DrawerTrigger>

  //     <DrawerContent className="container">
  //       <DrawerTitle className="font-sans text-2xl py-3 tracking-tight font-semibold">
  //         Choose a wallet
  //       </DrawerTitle>

  //       <ConnectorContent />
  //     </DrawerContent>
  //   </Drawer>
  // );
}

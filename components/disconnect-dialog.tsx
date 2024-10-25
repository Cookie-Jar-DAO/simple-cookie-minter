import { useAccount, useDisconnect } from "wagmi";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerTrigger,
// } from "@/components/ui/drawer";
// import { useMediaQuery } from "@/hooks/use-media-query";
import { truncateEthereumAddress } from "@/lib/utils";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Unlink, Wallet2 } from "lucide-react";
import { useEffect } from "react";

export default function DisconnectDialog({
  isDisconnectOpen,
  setIsDisconnectOpen,
  setIsConnectOpen,
}: {
  isDisconnectOpen: boolean;
  setIsDisconnectOpen: (isDisconnectOpen: boolean) => void;
  setIsConnectOpen: (isConnectOpen: boolean) => void;
}) {
  const { disconnect, isPending: isDisconnectPending, reset } = useDisconnect();
  const { address } = useAccount();
  // const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (isDisconnectOpen) reset();
  }, [isDisconnectOpen, reset]);

  const DisconnectorContent = () => (
    <div className="flex flex-col gap-2 pb-5">
      {/* {customConnectors.map((connector) => ( */}
      {address && (
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {truncateEthereumAddress(address)}
        </p>
      )}
      <Button
        className="flex items-center justify-between gap-2 py-6"
        disabled={isDisconnectPending}
        onClick={() => {
          disconnect();
          setIsConnectOpen(false);
        }}
        variant="default"
      >
        Yes, disconnect
        <Unlink size={16} />
      </Button>
    </div>
  );

  // if (isDesktop)
  return (
    <Dialog open={isDisconnectOpen} onOpenChange={setIsDisconnectOpen}>
      <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />

      <DialogTrigger asChild className="w-full cursor-pointer px-2 py-1.5">
        <p>Disconnect</p>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className="py-3 text-2xl font-semibold tracking-tight">
          Are you sure you want to disconnect your wallet?
        </DialogTitle>

        <DisconnectorContent />
      </DialogContent>
    </Dialog>
  );

  // return (
  //   <Drawer open={isDisconnectOpen} onOpenChange={setIsDisconnectOpen}>
  //     <DrawerClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />

  //     <DrawerTrigger
  //       asChild
  //       className={buttonVariants({ variant: "ghost", size: "sm" })}
  //     >
  //       <div className="flex items-center justify-center gap-2">
  //         Disconnect wallet
  //         <Wallet2 size={16} />
  //       </div>
  //     </DrawerTrigger>

  //     <DrawerContent className="container">
  //       <DialogTitle className="text-2xl py-3 tracking-tight font-semibold">
  //         Are you sure you want to disconnect your wallet?
  //       </DialogTitle>

  //       <DisconnectorContent />
  //     </DrawerContent>
  //   </Drawer>
  // );
}

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { truncateEthereumAddress } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";

import ConnectDialog from "@/components/connect-dialog";
import DisconnectDialog from "@/components/disconnect-dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { mainnet } from "viem/chains";
import { normalize } from "viem/ens";

const WalletProfile = ({
  alignment = "end",
}: {
  alignment?: "end" | "center" | "start";
}) => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const [ensName, setEnsName] = useState<string | undefined>(undefined);
  const [ensAvatar, setEnsAvatar] = useState<string | undefined>(undefined);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [isDisconnectOpen, setIsDisconnectOpen] = useState(false);

  const { data: nameData, error: nameError } = useEnsName({
    chainId: address ? mainnet.id : undefined,
    address,
  });

  useEffect(() => {
    if (!nameError && nameData) {
      setEnsName(nameData);
    }
  }, [nameData, nameError]);

  const { data: avatarData, error: avatarError } = useEnsAvatar({
    chainId: nameData ? mainnet.id : undefined,
    name: nameData ? normalize(nameData) : undefined,
  });

  useEffect(() => {
    if (!avatarError && avatarData) {
      setEnsAvatar(avatarData);
    }
  }, [avatarData, avatarError]);

  if (isConnecting) return <Loader2 className="animate-spin" />;
  if (isDisconnected)
    return (
      <ConnectDialog isOpen={isConnectOpen} setIsOpen={setIsConnectOpen} />
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"default"}
          size={"sm"}
          className="flex items-center justify-center space-x-2"
        >
          <div className="relative flex h-6 w-6 items-center overflow-hidden rounded-full border-[1.5px] border-white/60">
            <Avatar className="h-5 w-5 bg-stone-50">
              {ensAvatar && (
                <AvatarImage
                  src={ensAvatar}
                  alt="ENS Avatar"
                  className="object-cover object-center"
                />
              )}
              <AvatarFallback>
                <Image
                  src="/avatar-default.jpg"
                  alt="Default avatar"
                  fill
                  className="h-5 w-5 object-cover object-center"
                />
              </AvatarFallback>
            </Avatar>
          </div>
          <p className="hidden text-xs md:block">
            {ensName
              ? ensName
              : address
                ? truncateEthereumAddress(address)
                : "unknown address"}
          </p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-slate-50"
        align={alignment}
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {ensName && (
              <p className="text-sm font-medium leading-none">{ensName}</p>
            )}
            <p className="text-xs leading-none text-muted-foreground">
              {address ? truncateEthereumAddress(address) : "No address"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuGroup>
          <Link href={`/profile/${address}`}>
            <DropdownMenuItem className="cursor-pointer">
              Profile
            </DropdownMenuItem>
          </Link>
          <Link href={siteConfig.links.settings}>
            <DropdownMenuItem className="cursor-pointer">
              Settings
            </DropdownMenuItem>
          </Link>
          <Link href={siteConfig.links.evaluators}>
            <DropdownMenuItem className="cursor-pointer">
              Evaluators
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator /> */}
        <DisconnectDialog
          isDisconnectOpen={isDisconnectOpen}
          setIsDisconnectOpen={setIsDisconnectOpen}
          setIsConnectOpen={setIsConnectOpen}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

WalletProfile.displayName = "WalletProfile";

export { WalletProfile };

import { chainMetadata, supportedChains } from "@/config/endpoint";
import { Card } from "./ui/card";
import Image from "next/image";

interface ChainsSelectorProps {
  selectedId: number;
  setSelectedId: (val: number) => void;
}

const ChainsSelector = ({ selectedId, setSelectedId }: ChainsSelectorProps) => {
  return (
    <div className="flex-warp relative relative z-20 flex cursor-pointer flex-row justify-center gap-8 border-none bg-transparent bg-none">
      {supportedChains.map((id) => (
        <Card
          className={`border-none font-bold ${id === selectedId ? "bg-amber-300" : "bg-amber-100 hover:bg-amber-200 active:bg-amber-300"} p-3 text-center`}
          key={id}
          onClick={() => {
            setSelectedId(id);
          }}
        >
          <Image
            src={chainMetadata[id].logo}
            title={chainMetadata[id].name}
            alt="Chain logo"
            width={40}
            height={40}
            className="mr-2 inline-block"
          />
          {chainMetadata[id].name}
        </Card>
      ))}
    </div>
  );
};

export default ChainsSelector;

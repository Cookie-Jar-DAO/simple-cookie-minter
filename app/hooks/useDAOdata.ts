import { findDao } from '@daohaus/moloch-v3-data';
import { useQuery } from 'wagmi';

interface IDaoDataOptions {
    networkId: string;
    daoAddress: string;
    includeTokens?: boolean;
    graphApiKeys?: Record<string, string>;
}
export const fetchDAOdata = async ({
    networkId,
    daoAddress,
    includeTokens,
    graphApiKeys,
}: IDaoDataOptions) => {


        const data = await findDao({
            networkId: networkId as "0x1" | "0x5" | "0x64" | "0xa" | "0x89" | "0xa4b1" | "0xaa36a7" | "0x2105",
            dao: daoAddress,
            includeTokens: true,
            graphApiKeys: {
              [networkId]: process.env.NEXT_PUBLIC_MAINNET_GRAPH_KEY,
            },
          });

    return { data };

};

export const useDAOData = ({
    networkId,
    daoAddress,
    includeTokens,
    graphApiKeys,
}: IDaoDataOptions) => {
    const { data, error, ...rest } = useQuery(
      [`dao-data-${daoAddress}`],
      () => fetchDAOdata({ networkId, daoAddress, includeTokens, graphApiKeys}),
      { enabled: !!daoAddress }
    );
  
    return { ...data, error, ...rest };
  };
 

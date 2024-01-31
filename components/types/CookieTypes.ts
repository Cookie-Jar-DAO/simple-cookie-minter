import { SupportedImplementations } from "@/app/contracts";

export interface ICreateJarFormInput {
    cookieJar: SupportedImplementations;
    receiver: string;
    title: string;
    description: string;
    link: string;
    cookiePeriod: number;
    cookieAmount: string;
    cookieToken: string;
    erc20Token: string;
    erc20Threshold: string;
    donation: boolean;
    donationAmount?: string;
  }

  export interface ICreateJarFormInputERC20 {
    erc20Token: string;
    erc20Threshold: string;
  }

  export interface ICreateJarFormInputERC721 {
    erc20Token: string;
    erc20Threshold: string;
  }
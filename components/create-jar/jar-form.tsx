import React from "react";

import zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";

import { isAddress } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { jarSchema } from "@/components/create-jar/jar-schema";

const JarForm = () => {
	return <div>CreateJarForm</div>;
};

export { JarForm };

import { useJars } from "../hooks/useJars";
import { JarCard } from "@/components/JarCard";
import CreateJarFormERC20 from "../../components/CreateJarFormERC20";

export default function Home() {
  const { cookieJars } = useJars();

  if (!cookieJars) return <CreateJarFormERC20 />;

  return (
    <>
      {cookieJars.length > 0 ? (
        <JarCard cookieJar={cookieJars[0]} />
      ) : (
        <CreateJarFormERC20 />
      )}
    </>
  );
}

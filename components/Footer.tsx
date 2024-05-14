import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="dark-bg-opacity-90 bg-amber-100 bg-opacity-90 p-4 dark:bg-gray-800 dark:text-gray-100">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <p className="font-gluten text-2xl text-amber-950">
          Co Funded by the MetaFam
        </p>
        <div className="flex max-w-xl flex-row items-center justify-between gap-12">
          <a
            href="https://daohaus.club/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={"/daohaus.png"}
              alt="built by DAOHaus"
              width={75}
              height={75}
            />
          </a>
          <a
            href="https://publicnouns.wtf/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={"/publicnouns.png"}
              alt="built by Public Nouns"
              width={75}
              height={75}
            />
          </a>
          <a
            href="https://raidguild.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={"/raidguild.svg"}
              alt="built by Raid Guild"
              width={75}
              height={75}
            />
          </a>
          <a
            href="https://www.metacartel.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={"/metacartel.png"}
              alt="built by MetaCartel"
              width={75}
              height={75}
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

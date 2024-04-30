import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="dark-bg-opacity-90 bg-amber-100 bg-opacity-90 p-4 dark:bg-gray-800 dark:text-gray-100">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <h2>Co Funded by the MetaFam</h2>
        <div className="flex max-w-xl flex-row items-center justify-between gap-12">
          <a
            href="https://daohaus.club/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={"/daohaus.png"}
              alt="built by DAOHaus"
              width={150}
              height={150}
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
              width={150}
              height={150}
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
              width={150}
              height={150}
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
              width={150}
              height={150}
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

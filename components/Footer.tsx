import Image from "next/image";

const Footer = () => {
  return (
    <footer className="p-4 dark:bg-gray-800 dark:text-gray-100">
      <div className="container flex flex-col justify-center items-center mx-auto">
        <h2>Co Funded by the MetaFam</h2>
        <div className="flex flex-row gap-12 justify-between max-w-xl">
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

export default Footer;

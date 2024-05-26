import { db } from "../../lib/indexer";
import { useLiveQuery } from "dexie-react-hooks";

export const useJars = () => {
  const cookieJars = useLiveQuery(() => db.cookieJars.toArray());

  return { cookieJars };
};

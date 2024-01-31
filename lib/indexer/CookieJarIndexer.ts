import { decodeEventLog } from "viem";
import { db, CookieDB } from "./db";
import { AbiEvent, parseAbi, parseAbiItem } from "abitype";
import { EventHandlers, getEventHandler } from "./eventHandlers";
import { debounce } from "lodash";
import { postHandler } from "./posterHandlers";
import { PublicClient } from "wagmi";

interface CookieJarIndexerInterface {
  db: CookieDB;
  subscribe: (
    chainId: 5 | 100 | 11155111,
    address: `0x${string}`,
    event: AbiEvent,
    fromBlock: bigint,
    eventHandler: EventHandlers
  ) => void;
}

class CookieJarIndexer implements CookieJarIndexerInterface {
  private _publicClient: PublicClient;
  private _db: CookieDB;
  updating = false;
  update: () => void;

  constructor(publicClient: PublicClient) {
    this._db = db;
    this._publicClient = publicClient;

    this.update = debounce(async () => this._update(), 5000, {
      maxWait: 60000,
    });
    setInterval(this.update, 10000);
  }

  public get db() {
    return this._db;
  }

  _update = async () => {
    if (this.updating) {
      console.log("Already updating");
      return;
    }

    console.log("Updating");
    this.updating = true;
    const currentBlock = await this._publicClient.getBlockNumber();
    const chainId = await this._publicClient.getChainId();

    console.log("Current block: ", currentBlock);
    console.log("Chain ID: ", chainId);

    const subscriptions = await this.db.subscriptions
      .where({ chainId })
      .toArray();

    //TODO something cleaner than massice try-catch
    try {
      // Get cookie jars and claim events
      await Promise.all(
        subscriptions.map(async (s) => {
          if (s.lastBlock >= currentBlock) {
            return;
          }

          const events = await this._publicClient.getLogs({
            address: s.address,
            event: s.event,
            fromBlock: s.lastBlock,
            toBlock: currentBlock,
          });

          if (events.length === 0) {
            console.log(`No new events for ${s.address} on ${s.event.name}`);
          } else {
            const eventHandler = getEventHandler(s.eventHandler);
            if (!eventHandler) {
              console.error(`No event handler found for ${s.eventHandler}`);
              return;
            }
            console.log(
              `Got event for ${s.address} on ${s.event.name}`,
              events
            );
            await Promise.all(
              events.map(async (e) => eventHandler(e, this._publicClient))
            );
          }

          //TODO debounce/throttle this; currently calls update 3x
          await this.db.subscriptions.update(s, {
            lastBlock: currentBlock,
          });
        })
      );

      // Get Poster (0x000000000000cd17345801aa8147b8d3950260ff) events for cookie jars
      const cookieJars = (await this.db.cookieJars.toArray()).map(
        (jar) => jar.address as `0x${string}`
      );
      const posterState = await this.db.keyvals.get(`posterState-${chainId}`);

      if (posterState && cookieJars.length > 0) {
        console.log(`Getting posts from ${posterState.lastBlock}`);
        const posts = await this._publicClient.getLogs({
          address: "0x000000000000cd17345801aa8147b8d3950260ff",
          event: parseAbiItem(
            "event NewPost(address indexed user, string content, string indexed tag)"
          ),
          args: {
            user: cookieJars,
          },
          fromBlock: posterState.lastBlock,
        });

        if (posts.length === 0) {
          console.log(`No new posts`);
        } else {
          console.log(`Got posts`, posts);
          await Promise.all(
            posts.map(async (post) => {
              const decoded = decodeEventLog({
                abi: parseAbi([
                  "event NewPost(address indexed user, string content, string indexed tag)",
                ]),
                data: post.data,
                topics: post.topics,
              });
              postHandler(
                decoded.args.user, //user
                decoded.args.tag, //tag
                decoded.args.content, //content
                this._publicClient
              );
            })
          );
        }

        await this.db.keyvals.update(`posterState-${chainId}`, {
          lastBlock: currentBlock,
        });
      }
    } catch (e) {
      console.error("Failed to update", e);
    } finally {
      this.updating = false;
    }
  };

  subscribe = async (
    chainId: 5 | 100 | 11155111,
    address: `0x${string}`,
    event: AbiEvent,
    fromBlock: bigint,
    eventHandler: EventHandlers
  ) => {
    if (!this.db) {
      console.error("Database not initialized");
      return undefined;
    }

    console.log(`Subscribing to ${address} ${event.name} events`);

    try {
      const id = await this.db.subscriptions.add({
        chainId,
        address,
        event,
        eventHandler,
        fromBlock,
        lastBlock: fromBlock,
      });

      console.log(
        `Subscribed to ${address} ${event} events at id ${id} on chain ${chainId}`
      );
    } catch (e) {
      console.error("Failed to subscribe to event", e);
    }
  };
}

export default CookieJarIndexer;
